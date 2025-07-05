// Base API types
export interface APIResponse<T = any> {
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

// Rate limiting types
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// Revalidation API types
export interface RevalidationRequest {
  _type: string;
  slug?: string;
  tags?: string[];
}

export interface RevalidationResponse extends APIResponse {
  data?: {
    revalidated: boolean;
    timestamp: number;
    tags?: string[];
  };
}
