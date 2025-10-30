// Personal Details related TypeScript interfaces

export interface PersonalDetailsForm {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  alternateEmail: string;
  mobile: string;
  alternateMobile: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  nationality: string;
  emergencyContactName: string;
  emergencyContactMobile: string;
  emergencyContactRelation: string;
  presentAddress: string;
  permanentAddress: string;
  panNumber: string;
  aadharNumber: string;
  passportNumber: string;
  linkedinUrl: string;
  panDocument: File | null;
  aadharDocument: File | null;
}

export interface PersonalDetailsResponse {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  alternateEmail?: string;
  mobile?: string;
  alternateMobile?: string;
  gender?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  nationality?: string;
  emergencyContactName?: string;
  emergencyContactMobile?: string;
  emergencyContactRelation?: string;
  presentAddress?: string;
  permanentAddress?: string;
  panNumber?: string;
  aadharNumber?: string;
  passportNumber?: string;
  linkedinUrl?: string;
  joiningLocation?: string;
  profileImage?: string;
  status: 'INVITED' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED' | 'AWAITING_SUBMISSION' | 'CANDIDATE_SUBMITTED';
  candidateReferenceNo: string;
  clientId: string;
  clientName?: string;
  isPassportMandatory: boolean;
  expectedCtc?: string;
  expectedDoj?: string;
  negotiatedCtc?: string;
  negotiatedDoj?: string;
  negotiatedJoiningLocation?: string;
  jdId?: string;
  createdBy?: string;
  updatedBy?: string;
  updatedAt: string;
  createdAt: string;
}

export interface PersonalDetailsApiResponse {
  statusCode: number;
  success: boolean;
  data: PersonalDetailsResponse;
}

// File related interfaces
export interface CandidateFile {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  entityType: string;
  referenceType: string;
  candidateId: string;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  data?: CandidateFile;
}