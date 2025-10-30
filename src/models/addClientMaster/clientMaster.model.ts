export interface ClientMaster {
    id: string;
    category: string;
    clientName: string;
    status: string;
    address: string;
    agreementStartDate: string;
    agreementEndDate: string;
    candidateCoolingPeriod: string;
    pan: string;
    tan: string;
    gst: string;
    rateCardType: string;
    client_type: string;
    isPassportMandatory: boolean;
    createdBy: string | null;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string;
    firstPOC?: {
      contactPerson: string;
      designation: string;
      mobile: string;
      email: string;
    } | null;
    totalGSTCount?: number;
    hasGst?: boolean;
    logo?: { key: string; name: string } | null;
  }
  
  
  export interface BandDetail {
    id: string;
    bandName: string;
    experience: string;
    salary: string;
    description: string;
    createdAt: string;
    createdBy: string;
  }
  
  export interface PocDetail {
    id: string;
    contactPerson: string;
    designation: string;
    mobile: string;
    email: string;
    createdAt: string;
    createdBy: string;
  }
  
  export interface ClientFilter {
    value: string;
    label: string;
    count: number;
  }
  

  // Status Options
export const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'InActive' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'TERMINATED', label: 'Terminated' },
] as const;
// Category Options
export const categoryOptions = [
  { value: 'IT', label: 'IT' },
  { value: 'NON_IT', label: 'NON-IT' },
  { value: 'MANUFACTURING', label: 'Manufacturing' },
  { value: 'SERVICES', label: 'Services' },
  { value: 'OTHER', label: 'Other' },
] as const;

// Client Type Options
export const clientTypeOptions = [
  { value: 'SERVICE', label: 'Service' },
  { value: 'PRODUCT', label: 'Product' },
  { value: 'GCC', label: 'GCC' },
] as const;

// Rate Card Type Options
export const rateCardTypeOptions = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'HOURLY', label: 'Hourly' },
  { value: 'MONTHLY', label: 'Monthly' },
] as const;
  

export interface IClientLogoObjectStore {
  id: string;
  refId: number;
  refType: string;
  entityId: number;
  entityType: string;
  fileName: string;
}








