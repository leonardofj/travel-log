import axios, { AxiosResponse } from 'axios';

interface SaveDataConfig {
  path: string;
  data: Record<string, any>;
  headers?: Record<string, string>;
}

export const saveData = async <T>(config: SaveDataConfig): Promise<AxiosResponse<T>> => {
  const { path, data, headers } = config;
  const url=`http://0.0.0.0:8000/api/${path}/`
  try {
    const response = await axios.post<T>(url, data, { headers });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data);
      throw error.response?.data;
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};