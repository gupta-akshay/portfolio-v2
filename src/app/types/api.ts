export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactAPIResponse {
  message: string;
  success: boolean;
  errors?: Record<string, string[]>;
  statusCode?: number;
  data?: {
    emailSent: boolean;
    timestamp: Date;
  };
}
