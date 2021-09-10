import axios, { AxiosInstance } from "axios";
import { UserType } from "./UserType"

class ApiWrapper{
    BASE_URL = 'http://127.0.0.1:8000/';
    instance: AxiosInstance;

    ENPOINTS = {
        tokenAuth: 'token-auth/'
    }

    private userType = UserType.STUDENT;

    public static setUserType(userType: string) {
        this.userType = userType;
    }

    public static getUserType() {
        return this.userType;
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
        const {token, userType} = response.data;
        if (Object.values(UserType).includes(userType)) {
            this.setUserType(userType);
        }
        ApiWrapper.storeToken(token);
        this.setTokenAuth(token);
    }
}

const apiInstance = new ApiWrapper();
export default apiInstance