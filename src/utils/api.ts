import axios, {AxiosInstance} from "axios";
import {UserDetail} from "../redux/userSlice";
import {Meeting} from "../redux/meetingsSlice";
import {Assignment} from "../redux/assignmentSlice";

class ApiWrapper{
    BASE_URL = 'http://127.0.0.1:8000/';
    instance: AxiosInstance;

    ENDPOINTS = {
        tokenAuth: 'token-auth/',
        user: 'api/user/',
        meetings: 'api/meetings/',
        assignments: 'api/assignments/',
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
        const response = await this.instance.get(this.ENDPOINTS.user);
        return response.data;
    }

    async getMeetings(cohortId: number): Promise<Meeting[]> {
        const params = { cohort: cohortId };
        const response = await this.instance.get(this.ENDPOINTS.meetings, { params });
        return response.data;
    }

    async getAssignments(): Promise<Assignment[]> {
        const params = { }
        const response = await this.instance.get(this.ENDPOINTS.assignments, { params });
        return response.data;
    }

    async createAssignment(payload: Assignment): Promise<Assignment> {
        let response = await this.instance.post(this.ENDPOINTS.assignments, payload);
        // probably want some better logic here
        let fails = 0;
        while (response.status === 400 && fails < 10) {
            fails++;
            response = await this.instance.post(this.ENDPOINTS.assignments, payload);
        }
        return response.data;
    }

    async submitAssignment(payload: Submission)
}

const apiInstance = new ApiWrapper();
export default apiInstance