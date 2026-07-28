export interface Resume {
  _id: string;

  atsScore: number;
  summary: string;

  skills: string[];
  missingSkills: string[];
  strengths: string[];
  suggestions: string[];

  originalName: string;
  filePath: string;

  createdAt: string;
}
export interface ResumeAnalysis {

  _id: string;

  filename: string;

  atsScore: number;

  summary: string;

  skills: string[];

  missingSkills: string[];

  strengths: string[];

  suggestions: string[];

  createdAt: string;

}