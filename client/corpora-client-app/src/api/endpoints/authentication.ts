import { axiosInstance as axios } from '../axiosInstance';
import { BASE_URL } from '../url';

export async function login(
    username: string, 
    password: string
) {
    const payload = {
        username,
        password
    }

    const { data } = await axios.post(
        `${BASE_URL}/api/auth/login`,
        payload
    );

    return data;
}

export async function logout() {

    const { data } = await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {}
    );

    return data;
}

export async function checkToken() {
    const { data } = await axios.post(
        `${BASE_URL}/api/auth/check_token`,
        {}
    );

    return data;
}