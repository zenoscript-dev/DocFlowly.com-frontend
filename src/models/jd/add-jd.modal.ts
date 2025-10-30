// Enums matching backend
export const JdStatus = {
  INITIAL: 'INITIAL',
  DRAFT: 'DRAFT',
  IN_PROGRESS: 'IN_PROGRESS',
  AVAILABLE: 'AVAILABLE',
  NOT_AVAILABLE: 'NOT_AVAILABLE',
  SUBMITTED_TO_CLIENT: 'SUBMITTED_TO_CLIENT',
  AWAITING_CLIENT_APPROVAL: 'AWAITING_CLIENT_APPROVAL',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const;

export const JobType = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  INTERNSHIP: 'INTERNSHIP',
  FREELANCE: 'FREELANCE',
  TEMPORARY: 'TEMPORARY',
  OTHER: 'OTHER',
} as const;

export const WorkMode = {
  ON_SITE: 'ON_SITE',
  REMOTE: 'REMOTE',
  HYBRID: 'HYBRID',
} as const;

export const SalaryType = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  HOURLY: 'HOURLY',
  DAILY: 'DAILY',
  PROJECT_BASED: 'PROJECT_BASED',
} as const;

export const Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

export const Shift = {
  DAY: 'DAY',
  NIGHT: 'NIGHT',
  ROTATIONAL: 'ROTATIONAL',
  FLEXIBLE: 'FLEXIBLE',
} as const;

export type JdStatus = typeof JdStatus[keyof typeof JdStatus];
export type JobType = typeof JobType[keyof typeof JobType];
export type WorkMode = typeof WorkMode[keyof typeof WorkMode];
export type SalaryType = typeof SalaryType[keyof typeof SalaryType];
export type Priority = typeof Priority[keyof typeof Priority];
export type Shift = typeof Shift[keyof typeof Shift];


export const JOB_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FREELANCE', label: 'Freelance' },
  { value: 'TEMPORARY', label: 'Temporary' },
  { value: 'OTHER', label: 'Other' }
] as const;

export const WORK_MODES = [
  { value: 'ON_SITE', label: 'On Site' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' }
] as const;

export const PRIORITIES = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' }
] as const;

export const SHIFTS = [
  { value: 'DAY', label: 'Day' },
  { value: 'NIGHT', label: 'Night' },
  { value: 'ROTATIONAL', label: 'Rotational' },
  { value: 'FLEXIBLE', label: 'Flexible' }
] as const;

// Skills and Experience Constants
export const PREDEFINED_SKILLS = [
  'Leadership', 'Communication', 'Java', 'JavaScript', 'ReactJS', 'Node.js',
  'PHP', 'Python', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB',
  'TypeScript', 'Angular', 'Vue.js', 'Git', 'CI/CD', 'Agile', 'Scrum'
];

export const INTERVIEW_STAGES = [
  'Phone Screening',
  'Resume Review',
  'Initial HR Discussion',
  'Technical Assessment',
  'Coding Challenge',
  'Technical Interview',
  'System Design Interview',
  'Behavioral Interview',
  'Hiring Manager Interview',
  'Team Lead Interview',
  'Director Interview',
  'VP Interview',
  'Client Presentation',
  'Reference Check',
  'Background Verification',
  'Final HR Discussion',
  'Salary Negotiation',
  'Offer Letter Discussion',
  'Onboarding Discussion'
];

// Currency and Salary Constants
export const CURRENCY_OPTIONS = ['INR', 'USD', 'EUR', 'GBP'] as const;

export const SALARY_TYPE_OPTIONS = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
  { value: 'HOURLY', label: 'Hourly' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'PROJECT_BASED', label: 'Project Based' }
] as const;

// Supporting interfaces
export interface Location {
  city?: string;
  state?: string;
  address?: string;
  country?: string;
  zipcode?: string;
  locality?: string;
}

export interface ClientLogo {
  key?: string;
  name?: string;
}

export interface InterviewStage {
  stages?: Array<{
    name: string;
    round: number;
  }>;
}

export interface POC {
  id: string;
  contactPerson: string;
  designation: string;
  mobile: string;
  email: string;
}

export interface BandDetails {
  id: string;
  clientId: string;
  bandName: string;
  experience: number;
  salary: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt: string;
}

// Main JD interface
export interface IJd {
  id?: string;
  jobCode?: string;
  status?: JdStatus;
  clientId: string;
  assignedToHr?: string;
  assignToTeamMember?: string;
  jobTitle: string;
  jobDescription: string;
  jobType: JobType;
  noOfOpenPositions: number;
  workMode: WorkMode;
  department?: string;
  domain?: string;
  projectName?: string;
  location?: Location;
  salaryCurrency?: string;
  salaryMin?: number;
  salaryMax?: number;
  isSalaryNegotiable?: boolean;
  salaryType?: SalaryType;
  bandId?: string;
  relevantExperience?: Record<string, string | { min: number; max: number }>;
  experience?: { min: number; max: number } | number[];
  primarySkills?: string[];
  secondarySkills?: string[];
  mandatorySkills?: string[];
  qualificationRequired?: string;
  qualificationPreferred?: string;
  certifications?: string[];
  remarks?: string;
  positionsFilled?: number;
  priority?: Priority;
  postingDate?: Date;
  deadline?: Date;
  interviewStage?: InterviewStage;
  applicationProcess?: string;
  workPermitRequired?: boolean;
  travelRequired?: boolean;
  shift?: Shift;
  jobPostUrl?: string;
  tags?: string[];
  // Additional properties for extended functionality
  clientLogo?: ClientLogo;
  clientName?: string;
  clientAddress?: string;
  clientIndustry?: string;
  clientDescription?: string;
  responsibilities?: string[];
  jdPOCs?: POC[];
  bandDetails?: BandDetails;
  // API response properties
  activeUntil?: any;
  category?: any;
  createdAt?: string;
  updatedAt?: string;
}

// Type alias for form values
export type JdFormValues = IJd;

// Client type for dropdown
export interface ClientOption {
  id: string;
  name: string;
  email: string;
}


// Excel Upload Constants
export const EXCEL_JD_HEADERS = [
  'Job Code', 'Job Title', 'Job Description', 'Job Type', 'No Of Open Positions',
  'Work Mode', 'Department', 'Domain', 'Project Name', 'Location',
  'Salary Currency', 'Salary Min', 'Salary Max', 'Is Salary Negotiable',
  'Salary Type', 'Band ID', 'Relevant Experience', 'Experience',
  'Primary Skills', 'Secondary Skills', 'Mandatory Skills',
  'Qualification Required', 'Qualification Preferred', 'Certifications',
  'Remarks', 'Positions Filled', 'Priority', 'Posting Date', 'Deadline',
  'Interview Stage', 'Application Process', 'Work Permit Required',
  'Travel Required', 'Shift', 'Job Post URL', 'Tags'
] as const;

export const JD_HEADER_MAP: Record<string, string> = {
  'Job Code': 'jobCode',
  'Job Title': 'jobTitle',
  'Job Description': 'jobDescription',
  'Job Type': 'jobType',
  'No Of Open Positions': 'noOfOpenPositions',
  'Work Mode': 'workMode',
  'Department': 'department',
  'Domain': 'domain',
  'Project Name': 'projectName',
  'Location': 'location',
  'Salary Currency': 'salaryCurrency',
  'Salary Min': 'salaryMin',
  'Salary Max': 'salaryMax',
  'Is Salary Negotiable': 'isSalaryNegotiable',
  'Salary Type': 'salaryType',
  'Band ID': 'bandId',
  'Relevant Experience': 'relevantExperience',
  'Experience': 'experience',
  'Primary Skills': 'primarySkills',
  'Secondary Skills': 'secondarySkills',
  'Mandatory Skills': 'mandatorySkills',
  'Qualification Required': 'qualificationRequired',
  'Qualification Preferred': 'qualificationPreferred',
  'Certifications': 'certifications',
  'Remarks': 'remarks',
  'Positions Filled': 'positionsFilled',
  'Priority': 'priority',
  'Posting Date': 'postingDate',
  'Deadline': 'deadline',
  'Interview Stage': 'interviewStage',
  'Application Process': 'applicationProcess',
  'Work Permit Required': 'workPermitRequired',
  'Travel Required': 'travelRequired',
  'Shift': 'shift',
  'Job Post URL': 'jobPostUrl',
  'Tags': 'tags'
};

export const REQUIRED_FIELDS = [
  { field: 'jobCode', name: 'Job Code' },
  { field: 'jobTitle', name: 'Job Title' },
  { field: 'jobDescription', name: 'Job Description' },
  { field: 'jobType', name: 'Job Type' },
  { field: 'noOfOpenPositions', name: 'No Of Open Positions' },
  { field: 'workMode', name: 'Work Mode' },
  { field: 'location', name: 'Location' },
  { field: 'relevantExperience', name: 'Relevant Experience' },
  { field: 'experience', name: 'Experience' },
  { field: 'primarySkills', name: 'Primary Skills' },
  { field: 'mandatorySkills', name: 'Mandatory Skills' },
  { field: 'qualificationRequired', name: 'Qualification Required' },
  { field: 'postingDate', name: 'Posting Date' },
  { field: 'interviewStage', name: 'Interview Stage' },
];

// Excel JD Type
export interface ExcelJd {
  jobCode: string;
  jobTitle: string;
  jobDescription: string;
  jobType: string;
  noOfOpenPositions: number;
  workMode: string;
  department: string;
  domain: string;
  projectName: string;
  location: string;
  salaryCurrency: string;
  salaryMin: number;
  salaryMax: number;
  isSalaryNegotiable: boolean;
  salaryType: string;
  bandId: string;
  relevantExperience: string;
  experience: { min: number; max: number } | number[];
  primarySkills: string;
  secondarySkills: string;
  mandatorySkills: string;
  qualificationRequired: string;
  qualificationPreferred: string;
  certifications: string;
  remarks: string;
  positionsFilled: number;
  priority: string;
  postingDate: string;
  deadline: string;
  interviewStage: { stages: Array<{ name: string; round: number }> };
  applicationProcess: string;
  workPermitRequired: boolean;
  travelRequired: boolean;
  shift: string;
  jobPostUrl: string;
  tags: string;
  key?: number;
}

