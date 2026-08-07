"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Camera,
  Loader2,
  Save,
  MapPin,
  Link as LinkIcon,
  Briefcase,
} from "lucide-react";

import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  useProfile,
  useUpdateProfile,
  useUploadImage,
} from "@/hooks/useProfile";
import { useAuthStore } from "@/store/auth.store";
import { avatarFallback, resolveMediaUrl } from "@/lib/utils";

export default function ProfilePage() {
  const { data, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadImage = useUploadImage();
  const syncProfile = useAuthStore((state) => state.syncProfile);

  const user = data?.data;

  const coverInput = useRef<HTMLInputElement>(null);
  const profileInput = useRef<HTMLInputElement>(null);

  const [coverPreview, setCoverPreview] = useState("");
  const [profilePreview, setProfilePreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    headline: "",
    bio: "",
    github: "",
    linkedin: "",
    portfolio: "",
    location: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
        headline: user.headline ?? "",
        bio: user.bio ?? "",
        github: user.github ?? "",
        linkedin: user.linkedin ?? "",
        portfolio: user.portfolio ?? "",
        location: user.location ?? "",
      });
      setCoverPreview(resolveMediaUrl(user.coverImage));
      setProfilePreview(resolveMediaUrl(user.profileImage));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === "cover") {
      setCoverPreview(previewUrl);
    } else {
      setProfilePreview(previewUrl);
    }

    try {
      const res = await uploadImage.mutateAsync({ file, type });
      syncProfile(res.data);
      toast.success(
        type === "cover"
          ? "Cover image updated"
          : "Profile image updated"
      );
    } catch {
      toast.error("Upload failed");
      if (type === "cover") {
        setCoverPreview(resolveMediaUrl(user?.coverImage));
      } else {
        setProfilePreview(resolveMediaUrl(user?.profileImage));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateProfile.mutateAsync(form);
      if (res?.data) {
        syncProfile(res.data);
      }
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center text-xl dark:text-white">
          Loading profile...
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-10">

        <h1 className="mb-8 text-4xl font-black dark:text-white">
          My Profile
        </h1>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

          {/* Cover Image */}
          <div className="relative">
            <div
              className="group h-48 cursor-pointer bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 transition md:h-56"
              style={
                coverPreview
                  ? {
                      backgroundImage: `url(${coverPreview})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
              onClick={() => coverInput.current?.click()}
            >
              {coverPreview.startsWith("http") && (
                <img
                  src={coverPreview}
                  alt=""
                  className="hidden"
                  onError={() => setCoverPreview("")}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                <div className="flex items-center gap-2 rounded-xl bg-black/50 px-4 py-2 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
                  <Camera size={16} />
                  Change Cover
                </div>
              </div>
            </div>

            <input
              ref={coverInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "cover")}
            />

            {/* Profile Image */}
            <div className="absolute -bottom-16 left-8">
              <div
                className="group relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-slate-900"
                onClick={() => profileInput.current?.click()}
              >
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = "1";
                        setProfilePreview(avatarFallback(user?.name));
                      }
                    }}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-600 text-4xl font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                  <Camera
                    size={24}
                    className="text-white opacity-0 transition group-hover:opacity-100"
                  />
                </div>
              </div>

              <input
                ref={profileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "profile")}
              />
            </div>
          </div>

          {/* Form */}
          <div className="px-8 pt-24 pb-8">

            <div className="mb-8 flex items-center gap-6 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Briefcase size={16} />
                <span>{user?.role || "Candidate"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{form.location || "No location set"}</span>
              </div>
              {user?.email && (
                <div className="flex items-center gap-2">
                  <LinkIcon size={16} />
                  <span>{user.email}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Phone
                  </label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Headline
                </label>
                <Input
                  name="headline"
                  value={form.headline}
                  onChange={handleChange}
                  placeholder="e.g. Full-Stack Developer | React & Node.js"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Bio
                </label>
                <Textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell recruiters about yourself..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Location
                </label>
                <Input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="San Francisco, CA"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    GitHub
                  </label>
                  <Input
                    name="github"
                    value={form.github}
                    onChange={handleChange}
                    placeholder="github.com/username"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    LinkedIn
                  </label>
                  <Input
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Portfolio
                  </label>
                  <Input
                    name="portfolio"
                    value={form.portfolio}
                    onChange={handleChange}
                    placeholder="yoursite.com"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>

            </form>
          </div>

        </div>
      </main>
    </AuthGuard>
  );
}
