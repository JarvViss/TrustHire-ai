import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: "raw" | "image"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `trusthire/${folder}`,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          return reject(
            error ?? new Error("Cloudinary upload failed")
          );
        }

        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

function extractPublicId(url: string): string | null {
  try {
    const segments = url.split("/");
    const id = segments
      .slice(segments.indexOf("upload") + 1)
      .join("/")
      .split(".")[0];

    return id || null;
  } catch {
    return null;
  }
}

function deleteFromCloudinary(url: string): Promise<void> {
  const publicId = extractPublicId(url);

  if (!publicId) return Promise.resolve();

  return new Promise((resolve) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: "raw" },
      () => {
        cloudinary.uploader.destroy(
          publicId,
          { resource_type: "image" },
          () => resolve()
        );
      }
    );
  });
}

export async function storeFile(
  buffer: Buffer,
  folder: "resumes" | "images",
  resourceType: "raw" | "image",
  originalname?: string
): Promise<string> {
  if (isCloudinaryConfigured()) {
    return uploadToCloudinary(buffer, folder, resourceType);
  }

  const dir = path.join(process.cwd(), "uploads", folder);
  fs.mkdirSync(dir, { recursive: true });

  const safeName = (originalname ?? "file")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 80);

  const filename = `${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}-${safeName}`;

  fs.writeFileSync(path.join(dir, filename), buffer);

  return `/uploads/${folder}/${filename}`;
}

export async function deleteFile(url: string): Promise<void> {
  if (!url) return;

  if (/^https?:\/\//.test(url)) {
    return deleteFromCloudinary(url);
  }

  if (url.startsWith("/uploads/")) {
    const filePath = path.join(
      process.cwd(),
      url.replace(/^\//, "")
    );

    fs.rm(filePath, { force: true }, () => {});
  }
}
