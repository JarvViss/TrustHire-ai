import { Request, Response } from "express";
import Resume from "../models/Resume";
import { extractTextFromPDF } from "../services/pdf.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const uploadResume = async (
  req: AuthRequest,
  res: Response
) => {

  if (!req.file) {

    return res.status(400).json({

      success:false,

      message:"Resume required"

    });

  }

  const extractedText = await extractTextFromPDF(

    req.file.path

  );

  const resume = await Resume.create({

    user:req.userId,

    originalName:req.file.originalname,

    filePath:req.file.path,

    extractedText

  });

  res.json({

    success:true,

    data:resume

  });

};