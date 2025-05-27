const API_BASE_URL = 'http://localhost:50501/api';
// const API_BASE_URL = "https://insurance-portal-backend.vercel.app/api"


export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(data.message || 'API request failed');
    // Add extra props to the error object so the caller can access them
    (error as any).statusCode = response.status;
    (error as any).responseData = data;
    throw error;
  }

  return data;
}

