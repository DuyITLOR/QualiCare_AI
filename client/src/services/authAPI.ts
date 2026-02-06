const API_BASE_URL = import.meta.env.VITE_API_BASE || "/api";

interface LoginResponse {
  message: string;
  token: string;
  userId: string;
}

interface SignupResponse {
  message: string;
  token: string;
  userId: string;
}

interface ErrorResponse {
  error: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ErrorResponse;
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return data as T;
};

const createRequestOptions = (
  method: string = "GET",
  body: any = null,
): RequestInit => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  return options;
};

export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/signin`,
      createRequestOptions("POST", { email, password }),
    );
    return await handleResponse<LoginResponse>(response);
  },

  signup: async (
    email: string,
    password: string,
    phoneNumber?: string,
    name?: string,
    date?: string,
  ): Promise<SignupResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/signup`,
      createRequestOptions("POST", {
        email,
        password,
        phoneNumber,
        name,
        date,
      }),
    );
    return await handleResponse<SignupResponse>(response);
  },
};
