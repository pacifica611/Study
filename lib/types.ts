export type EnvironmentType = 'A' | 'B' | 'C';
export type SubjectCode = 'KOREAN' | 'MATH' | 'ENGLISH' | 'SCIENCE' | 'SOCIAL';

export type TimeBlockInput = {
  startHour: number;
  endHour: number;
  noiseLevel: 'LOW' | 'MID' | 'HIGH';
  handFree: boolean;
  focusReady: boolean;
};

export type StudyTaskInput = {
  id: string;
  title: string;
  subject: SubjectCode;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes: number;
  deliverable: string;
  type: 'DEEP' | 'RETRIEVAL' | 'MECHANICAL';
};

export type SessionInput = {
  sprintMinutes: number;
  completed: boolean;
  blankPageReview: boolean;
  explainAloud: boolean;
  retrievalRating: number;
};
