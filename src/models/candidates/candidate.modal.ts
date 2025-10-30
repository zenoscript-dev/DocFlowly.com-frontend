// Candidate-related TypeScript interfaces

export interface ICandidate {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  mobile?: string  // Changed from phone to mobile to match backend
  joiningLocation?: string  // Changed from location to joiningLocation to match backend
  linkedinUrl?: string
  profileImage?: string
  status: 'INVITED' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED' | 'AWAITING_SUBMISSION' | 'CANDIDATE_SUBMITTED'  // Updated to match backend enum values
  candidateReferenceNo: string  // Changed from referenceNo to candidateReferenceNo to match backend
  clientId: string
  clientName: string  // Added back clientName for display purposes
}

export interface CandidateFormData {
  clientName: string
  clientEmail: string
  clientContactPerson: string
  candidateFirstName: string
  candidateMiddleName?: string
  candidateLastName: string
  candidateEmail: string
  candidateMobile: string
}

export interface UpdateCandidateRequest {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  joiningLocation?: string;
  linkedinUrl?: string;
  profileImage?: string;
//   status?: 'INVITED' | 'AWAITING_SUBMISSION' | 'CANDIDATE_SUBMITTED';
  clientId?: string;
  clientName?: string;
  candidateReferenceNo?: string;
}

export interface CandidateResponse {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobile?: string;
  joiningLocation?: string;
  linkedinUrl?: string;
  profileImage?: string;
//   status: 'INVITED' | 'AWAITING_SUBMISSION' | 'CANDIDATE_SUBMITTED';
  candidateReferenceNo: string;
  clientId: string;
  clientName: string;
  updatedAt: string;
  createdAt: string;
}
