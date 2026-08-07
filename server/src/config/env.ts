import dotenv from "dotenv";
dotenv.config();

const REQUIRED = ["MONGO_URI", "JWT_SECRET", "GROQ_API_KEY"];

for (const key of REQUIRED) {
  if (!process.env[key]) {
    console.warn(`⚠️  Missing ${key} in environment`);
  }
}

const WEAK_SECRETS = [
  "trusthire_super_secret_key",
  "secret",
  "password",
  "changeme",
];

if (
  process.env.JWT_SECRET &&
  WEAK_SECRETS.includes(process.env.JWT_SECRET.toLowerCase())
) {
  console.warn(
    "⚠️  JWT_SECRET is weak. Set a long random value (e.g. openssl rand -hex 64)."
  );
}

if (process.env.MONGO_URI?.includes("<password>")) {
  console.warn(
    "⚠️  MONGO_URI still contains the placeholder <password>. MongoDB connections will fail."
  );
}

if (
  !process.env.CONTRACT_ADDRESS ||
  !process.env.VERIFIER_PRIVATE_KEY
) {
  console.warn(
    "⚠️  CONTRACT_ADDRESS / VERIFIER_PRIVATE_KEY not set — candidate verification will NOT be written on-chain (MongoDB fallback only)."
  );
}

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn(
    "⚠️  SMTP not configured — verification/reset codes will be logged to the console instead of emailed. Set SMTP_HOST/SMTP_USER/SMTP_PASS in .env."
  );
}
