import { Router } from "express";

import authRoutes from "./auth.routes";
import resumeRoutes from "./resume.routes";
import jobRoutes from "./job.routes";
import interviewRoutes from "./interview.routes";
import recruiterRoutes from "./recruiter.routes";
import userRoutes from "./user.routes";
import passwordResetRoutes from "./passwordReset.routes";
import adminRoutes from "./admin.routes";
import notificationRoutes from "./notification.routes";
import messageRoutes from "./message.routes";
import applicationRoutes from "./application.routes";
import interviewScheduleRoutes from "./interviewSchedule.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/resume", resumeRoutes);

router.use("/job", jobRoutes);

router.use("/interview", interviewRoutes);

router.use("/recruiter", recruiterRoutes);

router.use("/user", userRoutes);

router.use("/admin", adminRoutes);

router.use("/notifications", notificationRoutes);

router.use("/messages", messageRoutes);

router.use("/applications", applicationRoutes);

router.use("/schedule", interviewScheduleRoutes);

router.use("/auth", passwordResetRoutes);

export default router;