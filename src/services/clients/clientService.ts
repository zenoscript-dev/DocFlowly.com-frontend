import axiosInstance from '@/core/api/axiosInstance';

export interface Client {
  id: string;
  companyName: string;
  contactPersonName?: string;
  email: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  companyName: string;
  contactPersonName?: string;
  email: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  notes?: string;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {}

export interface QueryClientsDto {
  query?: string;
  filter?: string;
  sort?: 'recent' | 'az' | 'za' | 'docs';
  page?: number;
  limit?: number;
}

export interface ClientsResponse {
  success: boolean;
  message: string;
  data: Client[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ClientResponse {
  success: boolean;
  message: string;
  data: Client;
}

export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters: QueryClientsDto) => [...clientKeys.lists(), filters] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
};

export const clientService = {
  /**
   * Get all clients with filtering, sorting, and pagination
   */
  getAll: async (params?: QueryClientsDto): Promise<ClientsResponse> => {
    const response = await axiosInstance.get<ClientsResponse>('/clients', {
      params,
    });
    return response.data;
  },

  /**
   * Get a single client by ID
   */
  getOne: async (id: string): Promise<ClientResponse> => {
    const response = await axiosInstance.get<ClientResponse>(`/clients/${id}`);
    return response.data;
  },

  /**
   * Create a new client
   */
  create: async (data: CreateClientDto): Promise<ClientResponse> => {
    const response = await axiosInstance.post<ClientResponse>('/clients', data);
    return response.data;
  },

  /**
   * Update an existing client
   */
  update: async (id: string, data: UpdateClientDto): Promise<ClientResponse> => {
    const response = await axiosInstance.patch<ClientResponse>(
      `/clients/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete a client
   */
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete<{
      success: boolean;
      message: string;
    }>(`/clients/${id}`);
    return response.data;
  },
};

