Blockers (security — fix before deploying)
Password-reset token is leaked to the client. server/src/services/passwordReset.service.ts:33 returns the raw resetToken in the API response, and the client displays it ("Dev Mode — Reset Token") at client/src/app/forgot-password/page.tsx:57-66. Anyone requesting a reset for your email gets the token → account takeover. Fix: never return the token from the API; email it instead.
No email service. Related — the reset token is only delivered via that API response. There's no email sending at all (nodemailer/SendGrid absent), so password reset will be broken in production once you stop leaking the token. Need a mailer.
Weak JWT secret. server/.env has JWT_SECRET=trusthire_super_secret_key — your own config/env.ts:12-26 warns about it. Use openssl rand -hex 64.
Credentials were shared in this chat (Atlas password MONGO_URI, GROQ_API_KEY). Rotate both before deploying.
🔗 Blockchain (since it's "integrated")
Reality check: the contract is only deployed to your local Hardhat node (blockchain/ignition/deployments/chain-31337/). The env vars are the well-known Hardhat defaults and will NOT work in production:
RPC_URL=http://127.0.0.1:8545 — no local node in prod
CONTRACT_ADDRESS=0x5FbDB2315... — Hardhat's default deploy address
VERIFIER_PRIVATE_KEY=0xac0974... — Hardhat's public default test key (never use on a real network)
The contract itself (CertificateVerification.sol) is onlyOwner, with owner = deployer. So to go live:
Create a new wallet, fund it with Sepolia ETH (testnet) — or mainnet ETH if you want real verification.
Deploy with that wallet so it becomes the owner: npx hardhat ignition deploy ./ignition/modules/CertificateVerification.ts --network sepolia (needs SEPOLIA_RPC_URL + SEPOLIA_PRIVATE_KEY env).
Put the deployed address → CONTRACT_ADDRESS, the verifier wallet's key → VERIFIER_PRIVATE_KEY, and a real RPC (Alchemy/Infura/QuickNode/publicnode) → RPC_URL in server/.env.
Restart server; the POST /recruiter/candidate/:id/verify flow then writes on-chain (currently it silently does DB-only when blockchain is unconfigured).
⚙️ Config to set at deploy time
server/.env: MONGO_URI (prod Atlas DB), CLIENT_URL=https://your-domain.com (CORS — app.ts:24 already uses it), GROQ_API_KEY, NODE_ENV=production.
client: NEXT_PUBLIC_API_URL is inlined at build time (src/lib/axios.ts:6, utils.ts:9) — set it to https://api.your-domain.com/api when running next build. The localhost fallback will silently break prod if forgotten.
🚀 Deployment notes
Server: npm run build (tsc → dist/) then node dist/server.js, run from server/ (uploads path uses process.cwd(), app.ts:72). Needs a process manager (pm2) or a platform (Render/Railway/Fly/Docker). No Dockerfile/Procfile exists yet.
Client: next build + next start, or push to Vercel.
Uploads are on local disk (uploads/) and served publicly without auth (app.ts:72) — candidate resumes are accessible to anyone with the URL. On ephemeral hosts files are lost on restart. Use persistent storage (volume/S3) and consider auth-protecting /uploads.
Rate limiter is in-memory (rateLimiter.ts:11) — resets on restart, single-instance only. Fine for MVP.
Route guards are client-side only (no Next.js middleware.ts) — pages render as shells before redirect. Acceptable MVP.
✅ Already good
CORS restricted to CLIENT_URL + localhost, helmet, mongoSanitize, per-user AI rate limiting, PDF-only upload with 10MB limit, httpOnly+secure cookies, .env files gitignored.