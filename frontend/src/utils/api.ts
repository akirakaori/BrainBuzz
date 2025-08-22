// API utility functions for making authenticated requests

interface ApiResponse<T = any> {
  message: string;
  user?: T;
  error?: string;
}

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const apiCall = async <T = any>(
  url: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or parsing errors
    throw new ApiError(
      'Network error. Please check your connection and try again.',
      0
    );
  }
};

// Profile-specific API calls
export const profileApi = {
  // Get current user's profile
  getMyProfile: () => apiCall('/api/user/profile/me'),
  
  // Update current user's profile
  updateMyProfile: (profileData: { name: string; email: string; bio: string; skills: string }) =>
    apiCall('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
    
  // Get another user's profile
  getUserProfile: (userId: string) => apiCall(`/api/user/profile/${userId}`),
};
