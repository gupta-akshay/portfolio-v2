// Base API types
export interface APIResponse<T = unknown> {
  data?: T;
  message: string;
  success: boolean;
  error?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// Contact API types
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactAPIResponse extends APIResponse {
  data?: {
    emailSent: boolean;
    timestamp: Date;
  };
}
