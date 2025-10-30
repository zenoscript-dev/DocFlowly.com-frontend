import type { ProcessingStatus } from "@/utils/status";

export interface IResumeBank {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  resumeTitle: string;
  workExperience: string;
  annualSalary: string;
  currentLocation: string;
  preferredLocation: string;
  currentEmployer: string;
  designation: string;
  ugCourse: string;
  pgCourse: string;
  postPgCourse: string;
  ageDOB: string;
  skillsTags: string[];
  postalAddress: string;
  lastActive: string;
  commentOne: string;
  commentTwo: string;
  commentThree: string;
  commentFour: string;
  commentFive: string;
  status: ProcessingStatus;
}

export interface IResumeBankObjectStore {
  id: string;
  refId: number;
  refType: string;
  entityId: number;
  entityType: string;
  fileName: string;
}