import { ethers } from "ethers";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS ?? "";
const RPC_URL = process.env.RPC_URL ?? "http://127.0.0.1:8545";
const VERIFIER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY ?? "";

const ABI = [
  "function verifyCertificate(bytes32 hash, string candidateName, string resumeId, uint8 interviewScore) external",
  "function checkCertificate(bytes32 hash) external view returns (bool)",
  "function getCertificate(bytes32 hash) external view returns (bytes32 hash, string candidateName, string resumeId, uint8 interviewScore, uint256 timestamp)",
  "function revokeCertificate(bytes32 hash) external",
];

export const isBlockchainConfigured = () =>
  Boolean(CONTRACT_ADDRESS && VERIFIER_PRIVATE_KEY);

const getProvider = () => new ethers.JsonRpcProvider(RPC_URL);

export async function verifyCertificateOnChain(
  hash: string,
  candidateName: string,
  resumeId: string,
  interviewScore: number
): Promise<string> {
  const signer = new ethers.Wallet(
    VERIFIER_PRIVATE_KEY,
    getProvider()
  );
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  );

  const tx = await contract.verifyCertificate(
    hash,
    candidateName,
    resumeId,
    interviewScore
  );
  const receipt = await tx.wait();

  return receipt?.hash ?? "";
}

export async function checkCertificateOnChain(
  hash: string
): Promise<boolean> {
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    getProvider()
  );

  return contract.checkCertificate(hash);
}

export async function getCertificateOnChain(hash: string) {
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    getProvider()
  );

  return contract.getCertificate(hash);
}
