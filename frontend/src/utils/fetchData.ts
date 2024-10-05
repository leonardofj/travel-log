import axios from "axios";

type FetchDataResponse<T> = {
    data: T | null;
    error: string | null;
};

async function fetchData<T>(path: string): Promise<FetchDataResponse<T>> {
    const url=`http://0.0.0.0:8000/api/${path}`
    try {
        const response = await axios.get<T>(url);
        return {
            data: response.data,
            error: null
        };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                data: null,
                error: error.response.data as string
            };
        } else {
            return {
                data: null,
                error: 'An unexpected error occurred'
            };
        }
    }
}

export default fetchData;