const API_BASE_URL = (import.meta.env?.VITE_API_BASE || "/api") + "/auth";

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data: APIResponse<T> = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Unknown error occurred");
  }
  return data.data!;
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
  login: async (email: string, password: string) => {
    const response = await fetch(
      `${API_BASE_URL.replace("/chat", "")}/login`,
      createRequestOptions("POST", { email, password }),
    );
    return await handleResponse(response);
  },
};
