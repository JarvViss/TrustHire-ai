import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createApplication,
  getCandidateApplications,
  updateApplicationStatus,
} from "../services/application.service";

export async function applyToJob(
  req: AuthRequest,
  res: Response
) {
  try {
    const { jobTitle, company, jobDescription } =
      req.body;

    if (!jobTitle || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Job title and description are required",
      });
    }

    const application = await createApplication(
      req.userId!,
      jobTitle,
      company ?? "",
      jobDescription
    );

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getMyApplications(
  req: AuthRequest,
  res: Response
) {
  try {
    const applications =
      await getCandidateApplications(req.userId!);

    res.json({
      success: true,
      data: applications,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function updateStatus(
  req: AuthRequest,
  res: Response
) {
  try {
    const { status, notes } = req.body;

    const application =
      await updateApplicationStatus(
        req.params.id,
        status,
        notes
      );

    res.json({
      success: true,
      data: application,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
