export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    ENDPOINTS: {
        OPTIONS1: '/options1',
        OPTIONS2: '/options2',
        OPTIONS3: '/options3'
    }
} as const;

export const getApiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`; 