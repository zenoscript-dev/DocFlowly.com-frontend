export interface CandidateDetails {
  candidateId: string;
  relevanceScore: number;
}

export interface CandidateRequirementMappingRequest {
  clientId: string;
  jdId: string;
  candidateDetails: CandidateDetails[];
  status?: CandidateRequirementMappingStatus;
}

export interface CandidateRequirementMappingResponse {
  id: number;
  jdId: string;
  candidateId: string;
  clientId: string;
  mappedOn: string;
  relevanceScore?: number;
  status: CandidateRequirementMappingStatus;
  mappedBy: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
  requirement?: {
    id: string;
    jobTitle?: string;
    jobDescription?: string;
    location?: string;
    experience?: string;
    clientId?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  candidate?: {
    id: string;
    candidateName?: string;
    candidateEmail?: string;
    candidatePhone?: string;
    resumeTitle?: string;
    workExperience?: string | null;
    annualSalary?: string | null;
    currentLocation?: string | null;
    preferredLocation?: string | null;
    currentEmployer?: string | null;
    designation?: string | null;
    ugCourse?: string | null;
    pgCourse?: string | null;
    postPgCourse?: string | null;
    ageDOB?: string | null;
    skillsTags?: string[] | null;
    postalAddress?: string | null;
    lastActive?: string | null;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  client?: {
    id: string;
    clientName?: string;
    category?: string;
    status?: string;
    address?: string;
    agreementStartDate?: string;
    agreementEndDate?: string;
    pan?: string;
    tan?: string;
    gst?: string;
    rateCardType?: string;
    clientType?: string;
    isPassportMandatory?: boolean;
    candidateCoolingPeriod?: number;
    createdAt?: string;
    updatedAt?: string;
  };
}

// Union type for all possible backend status enums
export type CandidateRequirementMappingActionType =
  CandidateRequirementMappingStatus |
  CandidateRequirementMappingL1Status |
  CandidateRequirementMappingL2Status |
  CandidateRequirementMappingL3Status |
  CandidateRequirementMappingCulturalFitStatus |
  CandidateRequirementMappingOnboardingStatus |
  CandidateRequirementMappingMappedBy |
  CandidateRequirementMappingApprovedStatus;

export interface CandidateRequirementMappingHistoryRequest {
  jdId: string;
  candidateId: string;
  clientId: string;
  actionType: CandidateRequirementMappingActionType;
  comments?: string;
  reason?: string;
  interviewDate?: string;
  interviewStartTime?: string;
  interviewEndTime?: string;
}

export const CandidateRequirementMappingStatus = {
  MAPPED_TO_REQUIREMENT: "MAPPED_TO_REQUIREMENT",
  ACCEPTED_BY_HR_LEAD: "ACCEPTED_BY_HR_LEAD",
  REJECTED_BY_HR_LEAD: "REJECTED_BY_HR_LEAD",
  SENT_TO_CLIENT: "SENT_TO_CLIENT",
  ACCEPTED_BY_CLIENT: "ACCEPTED_BY_CLIENT",
  REJECTED_BY_CLIENT: "REJECTED_BY_CLIENT",
  SCREENING_REJECTED: "SCREENING_REJECTED",
  SCREENING_APPROVED: "SCREENING_APPROVED",
  CULTURAL_FIT_REJECTED: "CULTURAL_FIT_REJECTED",
  CULTURAL_FIT_APPROVED: "CULTURAL_FIT_APPROVED",
  HIRED_WAITING_FOR_ONBOARDING: "HIRED_WAITING_FOR_ONBOARDING",
  ONBOARDED: "ONBOARDED",
  // L1 Interview Statuses
  L1_SCHEDULED: "L1_SCHEDULED",
  L1_SELECTED: "L1_SELECTED",
  L1_REJECTED: "L1_REJECTED",
  // L2 Interview Statuses
  L2_SCHEDULED: "L2_SCHEDULED",
  L2_SELECTED: "L2_SELECTED",
  L2_REJECTED: "L2_REJECTED",
  // L3 Interview Statuses
  L3_SCHEDULED: "L3_SCHEDULED",
  L3_SELECTED: "L3_SELECTED",
  L3_REJECTED: "L3_REJECTED"
} as const;
export type CandidateRequirementMappingStatus = typeof CandidateRequirementMappingStatus[keyof typeof CandidateRequirementMappingStatus];

export const CandidateRequirementMappingL1Status = {
  L1_SCHEDULED: "L1_SCHEDULED",
  L1_SELECTED: "L1_SELECTED",
  L1_COMPLETED: "L1_COMPLETED",
  L1_REJECTED: "L1_REJECTED",
  L1_CANCELLED: "L1_CANCELLED",
  L1_ON_HOLD: "L1_ON_HOLD",
  L1_RESCHEDULED: "L1_RESCHEDULED",
  L1_NO_SHOW: "L1_NO_SHOW",
  L1_CANCELLED_BY_HR_LEAD: "L1_CANCELLED_BY_HR_LEAD",
  L1_CANCELLED_BY_CLIENT: "L1_CANCELLED_BY_CLIENT",
  L1_CANCELLED_BY_US: "L1_CANCELLED_BY_US",
  L1_CANCELLED_BY_CANDIDATE: "L1_CANCELLED_BY_CANDIDATE"
} as const;
export type CandidateRequirementMappingL1Status = typeof CandidateRequirementMappingL1Status[keyof typeof CandidateRequirementMappingL1Status];

export const CandidateRequirementMappingL2Status = {
  L2_SCHEDULED: "L2_SCHEDULED",
  L2_SELECTED: "L2_SELECTED",
  L2_COMPLETED: "L2_COMPLETED",
  L2_REJECTED: "L2_REJECTED",
  L2_CANCELLED: "L2_CANCELLED",
  L2_ON_HOLD: "L2_ON_HOLD",
  L2_RESCHEDULED: "L2_RESCHEDULED",
  L2_NO_SHOW: "L2_NO_SHOW",
  L2_CANCELLED_BY_CANDIDATE: "L2_CANCELLED_BY_CANDIDATE",
  L2_CANCELLED_BY_CLIENT: "L2_CANCELLED_BY_CLIENT",
  L2_CANCELLED_BY_US: "L2_CANCELLED_BY_US"
} as const;
export type CandidateRequirementMappingL2Status = typeof CandidateRequirementMappingL2Status[keyof typeof CandidateRequirementMappingL2Status];

export const CandidateRequirementMappingL3Status = {
  L3_SCHEDULED: "L3_SCHEDULED",
  L3_SELECTED: "L3_SELECTED",
  L3_COMPLETED: "L3_COMPLETED",
  L3_REJECTED: "L3_REJECTED",
  L3_CANCELLED: "L3_CANCELLED",
  L3_ON_HOLD: "L3_ON_HOLD",
  L3_RESCHEDULED: "L3_RESCHEDULED",
  L3_NO_SHOW: "L3_NO_SHOW",
  L3_CANCELLED_BY_HR_LEAD: "L3_CANCELLED_BY_HR_LEAD",
  L3_CANCELLED_BY_CLIENT: "L3_CANCELLED_BY_CLIENT",
  L3_CANCELLED_BY_US: "L3_CANCELLED_BY_US",
  L3_CANCELLED_BY_CANDIDATE: "L3_CANCELLED_BY_CANDIDATE"
} as const;
export type CandidateRequirementMappingL3Status = typeof CandidateRequirementMappingL3Status[keyof typeof CandidateRequirementMappingL3Status];

export const CandidateRequirementMappingCulturalFitStatus = {
  CULTURAL_FIT_SCHEDULED: "CULTURAL_FIT_SCHEDULED",
  CULTURAL_FIT_SELECTED: "CULTURAL_FIT_SELECTED",
  CULTURAL_FIT_COMPLETED: "CULTURAL_FIT_COMPLETED",
  CULTURAL_FIT_REJECTED: "CULTURAL_FIT_REJECTED",
  CULTURAL_FIT_CANCELLED: "CULTURAL_FIT_CANCELLED",
  CULTURAL_FIT_ON_HOLD: "CULTURAL_FIT_ON_HOLD",
  CULTURAL_FIT_CANCELLED_BY_HR_LEAD: "CULTURAL_FIT_CANCELLED_BY_HR_LEAD",
  CULTURAL_FIT_CANCELLED_BY_CLIENT: "CULTURAL_FIT_CANCELLED_BY_CLIENT",
  CULTURAL_FIT_CANCELLED_BY_US: "CULTURAL_FIT_CANCELLED_BY_US",
  CULTURAL_FIT_RESCHEDULED: "CULTURAL_FIT_RESCHEDULED",
  CULTURAL_FIT_NO_SHOW: "CULTURAL_FIT_NO_SHOW"
} as const;
export type CandidateRequirementMappingCulturalFitStatus = typeof CandidateRequirementMappingCulturalFitStatus[keyof typeof CandidateRequirementMappingCulturalFitStatus];

export const CandidateRequirementMappingOnboardingStatus = {
  ONBOARDING_SCHEDULED: "ONBOARDING_SCHEDULED",
  ONBOARDING_SELECTED: "ONBOARDING_SELECTED",
  ONBOARDING_COMPLETED: "ONBOARDING_COMPLETED",
  ONBOARDING_REJECTED: "ONBOARDING_REJECTED",
  ONBOARDING_CANCELLED: "ONBOARDING_CANCELLED",
  ONBOARDING_ON_HOLD: "ONBOARDING_ON_HOLD",
  ONBOARDING_CANCELLED_BY_HR_LEAD: "ONBOARDING_CANCELLED_BY_HR_LEAD",
  ONBOARDING_CANCELLED_BY_CLIENT: "ONBOARDING_CANCELLED_BY_CLIENT",
  ONBOARDING_CANCELLED_BY_US: "ONBOARDING_CANCELLED_BY_US",
  ONBOARDING_CANCELLED_BY_CANDIDATE: "ONBOARDING_CANCELLED_BY_CANDIDATE",
  ONBOARDING_RESCHEDULED: "ONBOARDING_RESCHEDULED",
  ONBOARDING_NO_SHOW: "ONBOARDING_NO_SHOW"
} as const;
export type CandidateRequirementMappingOnboardingStatus = typeof CandidateRequirementMappingOnboardingStatus[keyof typeof CandidateRequirementMappingOnboardingStatus];

export const CandidateRequirementMappingMappedBy = {
  SYSTEM: "SYSTEM",
  USER: "USER"
} as const;
export type CandidateRequirementMappingMappedBy = typeof CandidateRequirementMappingMappedBy[keyof typeof CandidateRequirementMappingMappedBy];

export const CandidateRequirementMappingApprovedStatus = {
  INTERVIEW_APPROVED: "INTERVIEW_APPROVED",
  OFFER_APPROVED_BY_CANDIDATE: "OFFER_APPROVED_BY_CANDIDATE",
  HIRED: "HIRED",
  APPROVED_BY_HR_LEAD: "APPROVED_BY_HR_LEAD",
  CLIENT_APPROVED: "CLIENT_APPROVED"
} as const;
export type CandidateRequirementMappingApprovedStatus = typeof CandidateRequirementMappingApprovedStatus[keyof typeof CandidateRequirementMappingApprovedStatus];

export interface FilterOptions {
  jdId?: string;
  candidateId?: string;
  clientId?: string;
  status?: CandidateRequirementMappingStatus;
  mappedBy?: string;
  fromDate?: Date;
  toDate?: Date;
  minRelevanceScore?: number;
  maxRelevanceScore?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  jdId?: string;
  candidateId?: string;
  clientId?: string;
  status?: CandidateRequirementMappingStatus;
  search?: string;
  mappedBy?: string;
  fromDate?: string;
  toDate?: string;
  minRelevanceScore?: number;
  maxRelevanceScore?: number;
  includeRelations?: boolean;
}