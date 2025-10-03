const API_BASE_URL = (import.meta.env?.VITE_API_BASE || '/api') + '/auth';


const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }
      return data.data;
};

const createRequestOptions = (method = 'GET', body = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    return options;
}

export const authAPI = {
    login: async (email, password) => {
        const response = await fetch(
            `${API_BASE_URL.replace('/chat', '')}/login`,
            createRequestOptions('POST', { email, password })
        )
        return await handleResponse(response);
    }
}
