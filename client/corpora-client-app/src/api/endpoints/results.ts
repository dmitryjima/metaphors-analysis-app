import { axiosInstance as axios } from '../axiosInstance';
import { BASE_URL } from '../url';

export async function fetchResults(): Promise<any> {
    const { data } = await axios.get(
        `${BASE_URL}/api/results/`,
    );

    return data;
}