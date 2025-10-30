export interface DataSource {
  id: string;
  providerId: string;
  appName: string;
  integrationType: string;
  accountEmail: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  scopes?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  tokenExpiry?: string;
  providerConfig?: Record<string, any>;
  webhookSecret?: string;
  status: string;
  isPrimary: boolean;
  syncEnabled: boolean;
  webhookUrl?: string;
  webhookEnabled: boolean;
  version: number;
  connectedAt?: string;
  disconnectedAt?: string;
  lastActivityAt?: string;
  createdBy: string | null;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
}

export interface DataSourceFilter {
  value: string;
  label: string;
  count: number;
}

// Status Options
export const dataSourceStatusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'CONNECTING', label: 'Connecting' },
  { value: 'DISCONNECTED', label: 'Disconnected' },
  { value: 'ERROR', label: 'Error' },
] as const;

// Provider Options - matching API enum values
export const providerOptions = [
  { value: 'gmail', label: 'Gmail' },
  { value: 'outlook', label: 'Outlook' },
  { value: 'yahoo-mail', label: 'Yahoo Mail' },
  { value: 'zoho-mail', label: 'Zoho Mail' },
  { value: 'proton-mail', label: 'Proton Mail' },
  { value: 'apple-mail', label: 'Apple Mail' },
  { value: 'exchange', label: 'Microsoft Exchange' },
] as const;

// Integration Type Options - matching API enum values
export const integrationTypeOptions = [
  { value: 'email', label: 'Email' },
  { value: 'cloud-storage', label: 'Cloud Storage' },
  { value: 'database', label: 'Database' },
  { value: 'messaging', label: 'Messaging' },
  { value: 'other', label: 'Other' },
] as const;

// Token Type Options
export const tokenTypeOptions = [
  { value: 'BEARER', label: 'Bearer' },
  { value: 'BASIC', label: 'Basic' },
  { value: 'API_KEY', label: 'API Key' },
  { value: 'OAUTH2', label: 'OAuth 2.0' },
] as const;
