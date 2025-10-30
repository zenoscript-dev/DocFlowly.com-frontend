// Enums based on backend
export const MasterOrganizationPipelineActive = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type MasterOrganizationPipelineActive =
  (typeof MasterOrganizationPipelineActive)[keyof typeof MasterOrganizationPipelineActive];

export const MasterOrganizationPipelineStatus = {
  DRAFT: 'DRAFT',
  STAGE: 'STAGE',
} as const;

export type MasterOrganizationPipelineStatus =
  (typeof MasterOrganizationPipelineStatus)[keyof typeof MasterOrganizationPipelineStatus];

// Main interface for MasterOrganizationPipeline
export interface MasterOrganizationPipeline {
  id: string;
  orgId: string;
  pipelineName: string;
  description?: string;
  isActive: MasterOrganizationPipelineActive;
  status: MasterOrganizationPipelineStatus;
  version: number;
  stages?: MasterPipelineStage[];
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

// Pipeline Stage interface (from backend relationship)
export interface MasterPipelineStage {
  id: string;
  pipelineId: string;
  stageName: string;
  stageOrder: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Filter interface
export interface PipelineFilter {
  value: string;
  label: string;
  count: number;
}

// Status Options
export const statusOptions = [
  { value: 'DRAFT' as const, label: 'Draft' },
  { value: 'STAGE' as const, label: 'Stage' },
] as const;

// Active Status Options
export const activeStatusOptions = [
  { value: 'ACTIVE' as const, label: 'Active' },
  { value: 'INACTIVE' as const, label: 'Inactive' },
] as const;

