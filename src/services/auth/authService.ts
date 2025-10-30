import axiosInstance from "@/core/api/axiosInstance";

export interface SigninRequest {
  email: string;
  password: string;
}

export interface PostDetails {
  createdBy: string | null;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
  id: number;
  name: string;
  roleId: number;
  roleName: string;
  email: string;
  locationId: number;
  locationName: string;
  locationAddress: string;
  locationCity: string;
  locationState: string;
}

export interface SigninResponseData {
  role: string;
  permission: string[];
  managersAssignedToPost: [];
  postDetails: PostDetails;
  accessToken: string;
  id: string;
  loginId: string;
  userType: string;
  status: string;
  lastLoggedIn: string | null;
  changePasswordRequired: boolean;
  lastPasswordChanged: string | null;
  resetRequired: boolean;
  mobileVerification: string | null;
}

export interface SigninResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      role: string;
      emailVerified: boolean;
    };
    expiresAt: number;
  };
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      role: string;
      emailVerified: boolean;
    };
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export const authKeys = {
  LOGIN: 'login',
  REFRESH: 'refresh',
  LOGOUT: 'logout',
  ME: 'me',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
  VERIFY_EMAIL: 'verify-email',
  RESEND_VERIFICATION: 'resend-verification',
}

export const authService = {
  /**
   * Sign in user with email and password
   */
  signin: async (email: string, password: string): Promise<SigninResponse> => {
    const response = await axiosInstance.post<SigninResponse>('/auth/signin', { 
      email, 
      password 
    }, {
      withCredentials: true, // Important for receiving cookies
    });
    return response.data;
  },

  /**
   * Sign up new user
   */
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axiosInstance.post<SignupResponse>('/auth/signup', data, {
      withCredentials: true,
    });
    return response.data;
  },

  /**
   * Refresh authentication token (uses refresh token from cookie)
   */
  refreshToken: async (): Promise<{ accessToken: string; expiresAt: number }> => {
    const response = await axiosInstance.post<{ accessToken: string; expiresAt: number }>('/auth/refresh', {}, {
      withCredentials: true, // Important for sending cookies
    });
    return response.data;
  },

  /**
   * Sign out user
   */
  signout: async (): Promise<void> => {
    try {
      await axiosInstance.post('/auth/signout', {}, {
        withCredentials: true, // Important for clearing cookies
      });
    } catch (error) {
      // Don't throw error for signout, just log it
      console.warn('Signout error:', error);
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<{
    success: boolean;
    data: {
      user: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        role: string;
        emailVerified: boolean;
      };
    };
  }> => {
    const response = await axiosInstance.get<{
      success: boolean;
      data: {
        user: {
          id: string;
          email: string;
          firstName?: string;
          lastName?: string;
          role: string;
          emailVerified: boolean;
        };
      };
    }>('/auth/me');
    return response.data;
  },

  /**
   * Forgot password request
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>('/auth/reset-password', { 
      token, 
      newPassword 
    });
    return response.data;
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Resend email verification
   */
  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>('/auth/resend-verification', { email });
    return response.data;
  }
};
