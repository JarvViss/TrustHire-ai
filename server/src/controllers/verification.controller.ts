import { Request, Response, NextFunction } from "express";

import User from "../models/User";
import {
  isBlockchainConfigured,
  checkCertificateOnChain,
} from "../services/verification.service";

export async function checkVerification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const hash = String(req.params.hash).toLowerCase();

    if (!/^0x[0-9a-f]{64}$/.test(hash)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification hash",
      });
    }

    const candidate = await User.findOne({
      verificationHash: hash,
    }).select("-password -resetToken -resetTokenExpiry");

    let onChain: boolean | null = null;

    if (isBlockchainConfigured()) {
      onChain = await checkCertificateOnChain(hash);
    }

    res.json({
      success: true,
      data: {
        onChain,
        candidate: candidate ?? null,
      },
    });
  } catch (err) {
    next(err);
  }
}
