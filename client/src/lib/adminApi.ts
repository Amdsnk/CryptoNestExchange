import { toast } from "@/hooks/use-toast";

/**
 * Error types for admin API operations
 */
export type ApiErrorCode = 
  | "AUTH_REQUIRED" 
  | "ADMIN_REQUIRED" 
  | "INVALID_INPUT" 
  | "USER_NOT_FOUND"
  | "TRANSACTION_NOT_FOUND"
  | "INVALID_TRANSACTION_STATUS"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

/**
 * API error with structured data
 */
export interface ApiError {
  message: string;
  code: ApiErrorCode;
  status: number;
  details?: any;
}

/**
 * Options for API requests
 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  showErrorToast?: boolean;
  retries?: number;
}

/**
 * Makes an authenticated API request with error handling
 */
export async function adminApiRequest<T = any>(
  endpoint: string, 
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    showErrorToast = true,
    retries = 1
  } = options;

  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    credentials: 'include',
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  let retriesLeft = retries;
  let lastError: any;

  while (retriesLeft >= 0) {
    try {
      // Add a timestamp to prevent caching for GET requests
      const timestampedUrl = method === 'GET' 
        ? `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}` 
        : url;
  
      const response = await fetch(timestampedUrl, requestOptions);
      
      // Handle authentication errors
      if (response.status === 401) {
        const error: ApiError = {
          message: "Authentication required. Please log in.",
          code: "AUTH_REQUIRED",
          status: 401
        };
        throw error;
      }
      
      // Handle admin authorization errors
      if (response.status === 403) {
        const error: ApiError = {
          message: "Admin access required for this operation.",
          code: "ADMIN_REQUIRED",
          status: 403
        };
        throw error;
      }
      
      // Handle all other error responses
      if (!response.ok) {
        let errorData: any;
        
        try {
          errorData = await response.json();
        } catch (error) {
          // If the response can't be parsed as JSON, use the status text
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          errorData = { 
            message: response.statusText || 'Unknown error occurred', 
            code: 'UNKNOWN_ERROR',
            error: { 
              status: response.status,
              details: `Could not parse error response: ${errorMessage}`
            }
          };
        }
        
        // Handle 429 rate limit errors specifically
        if (response.status === 429) {
          const error: ApiError = {
            message: "Too many login attempts. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED" as any,
            status: 429,
            details: errorData.error
          };
          throw error;
        }
        
        const error: ApiError = {
          message: errorData.error?.message || errorData.message || `Request failed with status: ${response.status}`,
          code: errorData.error?.code || errorData.code || 'UNKNOWN_ERROR',
          status: response.status,
          details: errorData.error || errorData.details
        };
        
        throw error;
      }
      
      // For successful responses, return parsed JSON
      try {
        const data = await response.json();
        return data as T;
      } catch (e) {
        console.error("JSON parsing error:", e);
        // Return a valid object structure to prevent the "Unexpected end of JSON input" error
        // This is a fallback in case the server returns an invalid or empty JSON response
        return { error: "Invalid server response", success: false } as any;
      }
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on authentication/authorization errors
      if (error.status === 401 || error.status === 403) {
        break;
      }
      
      // Don't retry on validation errors
      if (error.code === 'INVALID_INPUT') {
        break;
      }
      
      retriesLeft--;
      
      // Only retry on network errors or server errors
      if (
        (error instanceof TypeError && error.message.includes('network')) ||
        (error.status >= 500 && error.status < 600)
      ) {
        // Wait before retrying (with exponential backoff)
        if (retriesLeft >= 0) {
          const delay = Math.pow(2, retries - retriesLeft) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      } else {
        // Don't retry for other errors
        break;
      }
    }
  }
  
  // If we get here, all retries failed
  if (showErrorToast && lastError) {
    toast({
      title: getErrorTitle(lastError),
      description: getErrorMessage(lastError),
      variant: "destructive",
    });
  }
  
  throw lastError;
}

/**
 * Gets an appropriate error title based on the error
 */
function getErrorTitle(error: ApiError): string {
  if (error.code === 'AUTH_REQUIRED') {
    return 'Authentication Required';
  }
  
  if (error.code === 'ADMIN_REQUIRED') {
    return 'Admin Access Required';
  }
  
  if (error.code === 'INVALID_INPUT') {
    return 'Invalid Input';
  }
  
  if (error.code === 'USER_NOT_FOUND') {
    return 'User Not Found';
  }
  
  if (error.code === 'TRANSACTION_NOT_FOUND') {
    return 'Transaction Not Found';
  }
  
  if (error.code === 'INVALID_TRANSACTION_STATUS') {
    return 'Invalid Transaction Status';
  }
  
  if (error.code === 'SERVER_ERROR') {
    return 'Server Error';
  }
  
  if (error.code === 'NETWORK_ERROR') {
    return 'Network Error';
  }
  
  return 'Unexpected Error';
}

/**
 * Gets a user-friendly error message based on the error
 */
function getErrorMessage(error: ApiError): string {
  if (error.code === 'AUTH_REQUIRED') {
    return 'Please log in to continue. Your session may have expired.';
  }
  
  if (error.code === 'ADMIN_REQUIRED') {
    return 'This action requires administrator privileges.';
  }
  
  if (error.code === 'NETWORK_ERROR') {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  // For other errors, use the message from the server
  return error.message || 'An unexpected error occurred.';
}

/**
 * Admin API client with specific endpoints
 */
export const adminApi = {
  // Authentication
  getCurrentAdmin: () => adminApiRequest<any>('/api/auth/admin/me'),
  loginAdmin: (credentials: { username: string; password: string }) => 
    adminApiRequest<any>('/api/auth/admin-login', { method: 'POST', body: credentials }),
  
  // Users
  getUsers: () => adminApiRequest<any[]>('/api/admin/users'),
  getUserDetails: (userId: string) => adminApiRequest<any>(`/api/admin/users/${userId}`),
  updateUser: (userId: string, userData: any) => 
    adminApiRequest<any>(`/api/admin/users/${userId}`, { method: 'PUT', body: userData }),
  
  // Transactions
  getTransactions: (params?: { limit?: number; offset?: number }) => {
    const queryString = params 
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';
    return adminApiRequest<any>(`/api/admin/transactions${queryString}`);
  },
  approveTransaction: (transactionId: number) => 
    adminApiRequest<any>(`/api/admin/transactions/${transactionId}/approve`, { method: 'POST' }),
  
  // Stats and Dashboard
  getStats: () => adminApiRequest<any>('/api/admin/stats'),
};