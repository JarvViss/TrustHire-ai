import { PDFParse } from "pdf-parse";

export const extractTextFromPDF = async (
  filePath: string
): Promise<string> => {
  const parser = new PDFParse({ url: filePath });

  const result = await parser.getText();

  return result.text;
};