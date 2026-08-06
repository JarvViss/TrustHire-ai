import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import {
  dashboardStats,
  candidateList,
  getCandidateProfile,
  changeCandidateStatus,
  verifyCandidate,
} from "../services/recruiter.service";

export async function getDashboardStats(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const stats = await dashboardStats();

    res.json({
      success: true,
      stats,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCandidates(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const candidates = await candidateList();

    res.json({
      success: true,
      candidates,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCandidateById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const candidate = await getCandidateProfile(
      String(req.params.id)
    );

    res.json({
      success: true,
      candidate,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateCandidateStatus(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const candidate = await changeCandidateStatus(
      String(req.params.id),
      req.userId!,
      status,
      notes ?? ""
    );

    res.json({
      success: true,
      candidate,
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyCandidateBlockchain(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const candidate = await verifyCandidate(
      String(req.params.id)
    );

    res.json({
      success: true,
      candidate,
    });
  } catch (err) {
    next(err);
  }
}
