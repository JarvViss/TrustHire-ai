import * as pdfParse from "pdf-parse";
import fs from "fs";

export const extractTextFromPDF = async (
  filePath: string
): Promise<string> => {

  const buffer = fs.readFileSync(filePath);

  const data = await (pdfParse as any)(buffer);

  return data.text;
};