import { Response } from "express";
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
  res: Response
) {
  try {
    const stats = await dashboardStats();

    res.json({
      success: true,
      stats,
    });
  } catch {
    res.status(500).json({
      success: false,
    });
  }
}

export async function getCandidates(
  req: AuthRequest,
  res: Response
) {
  try {
    const candidates = await candidateList();

    res.json({
      success: true,
      candidates,
    });
  } catch {
    res.status(500).json({
      success: false,
    });
  }
}

export async function getCandidateById(
  req: AuthRequest,
  res: Response
) {
  try {
    const candidate = await getCandidateProfile(
      req.params.id
    );

    res.json({
      success: true,
      candidate,
    });
  } catch {
    res.status(404).json({
      success: false,
    });
  }
}

export async function updateCandidateStatus(
  req: AuthRequest,
  res: Response
) {
  try {
    const { status, notes } = req.body;

    const candidate = await changeCandidateStatus(
      req.params.id,
      req.userId!,
      status,
      notes ?? ""
    );

    res.json({
      success: true,
      candidate,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function verifyCandidateBlockchain(
  req: AuthRequest,
  res: Response
) {
  try {
    const candidate = await verifyCandidate(
      req.params.id
    );

    res.json({
      success: true,
      candidate,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
