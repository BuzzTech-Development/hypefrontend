import axios, { AxiosInstance } from "axios";

class ApiWrapper{
    BASE_URL = 'http://127.0.0.1:8000/';
    instance: AxiosInstance;

    ENPOINTS = {
        tokenAuth: 'token-auth/'
    }

    private static getToken() {
        return localStorage.getItem('token');
    }

    private static storeToken(token: string) {
        localStorage.setItem('token', token);
    }

    private static removeToken() {
        localStorage.removeItem('token');
    }

    setTokenAuth(token: string) {
        this.instance.defaults.headers.common.Authorization = `JWT ${token}`;
    }

    removeTokenAuth() {
        ApiWrapper.removeToken();
        this.instance.defaults.headers.common.Authorization = undefined;
    }

    constructor() {
        this.instance = axios.create({
            baseURL: this.BASE_URL,
        })
    }

    async login(payload: { username: string, password: string }) {
        const response = await this.instance.post(this.ENPOINTS.tokenAuth, payload);
        const token = response.data;
        ApiWrapper.storeToken(token);
        this.setTokenAuth(token);
    }
}

const apiInstance = new ApiWrapper();
export default apiInstance