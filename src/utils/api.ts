import axios, { AxiosInstance } from "axios";
import { UserDetail } from "../redux/userSlice";
import {Meeting} from "../redux/meetingsSlice";
import { CohortDetail } from "redux/cohortSlice";

class ApiWrapper{
    BASE_URL = 'http://127.0.0.1:8000/';
    instance: AxiosInstance;

    ENDPOINTS = {
        tokenAuth: 'token-auth/',
        users: 'api/user/',
        students: 'api/user/students',
        curr_user: 'api/user/curr',
        meetings: 'api/meetings/',
        assignments: 'assignments/',
        cohorts: 'api/cohorts/'
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
        console.log(token);
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

    async login(payload: { username: string, password: string }): Promise<UserDetail> {
        const response = await this.instance.post(this.ENDPOINTS.tokenAuth, payload);
        const token: string = response.data.token;
        ApiWrapper.storeToken(token);
        this.setTokenAuth(token);
        return this.getUserDetail();
    }

    async getUserDetail(): Promise<UserDetail> {
        const response = await this.instance.get(this.ENDPOINTS.curr_user);
        return response.data;
    }

    async getUsers(): Promise<UserDetail[]>  {
        const response = await this.instance.get(this.ENDPOINTS.users); 
        return response.data;
    }

    async getStudents(): Promise<UserDetail[]> {
        const response = await this.instance.get(this.ENDPOINTS.students); 
        return response.data;
    }

    async getMeetings(cohortId: number): Promise<Meeting[]> {
        const params = { cohort: cohortId };
        const response = await this.instance.get(this.ENDPOINTS.meetings, { params });
        return response.data;
    }

    async getCohorts(): Promise<CohortDetail[]> {
        const response = await this.instance.get(this.ENDPOINTS.cohorts);
        return response.data;
    }

    async createAssignment(payload: Object) {
        const response = await this.instance.post(this.ENDPOINTS.assignments, payload);
        const result = response.data;
        return result;
    }
}

const apiInstance = new ApiWrapper();
export default apiInstance