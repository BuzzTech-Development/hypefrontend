import axios, {AxiosInstance, AxiosResponse} from "axios";
import {UserDetail} from "../redux/userSlice";
import {Meeting} from "../redux/meetingsSlice";
import { Cohort } from "redux/userSlice";
import {Assignment} from "../redux/assignmentSlice";
import {Submission} from "../redux/submissionSlice";
import {Announcement} from "redux/announcementsSlice";

class ApiWrapper{
    BASE_URL = 'http://127.0.0.1:8000/';
    instance: AxiosInstance;

    readonly ENDPOINTS = {
        tokenAuth: 'token-auth/',
        tokenRefresh: 'api-token-refresh/',
        tokenVerify: 'api-token-verify/',
        users: 'api/users/',
        students: 'api/users/students/',
        curr_user: 'api/users/curr/',
        meetings: 'api/meetings/',
        cohorts: 'api/cohorts/',
        assignments: 'api/assignments/',
        submissions: 'api/submissions/',
        announcements: 'api/announcements/'
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
    // Not sure what this should return
    async refreshToken() : Promise<UserDetail> {
        const cachedToken = ApiWrapper.getToken();
        const payload = {'token': cachedToken};
        const response = await this.instance.post(this.ENDPOINTS.tokenRefresh, payload);
        ApiWrapper.storeToken(response.data.token);
        this.setTokenAuth(response.data.token);
        return this.getUserDetail();
    }

    // dealing with promises?
    async verifyToken() : Promise<UserDetail>{
        const cachedToken = ApiWrapper.getToken();
        if (cachedToken === null || cachedToken === undefined || cachedToken === "") {
            return Promise.reject("No token");
        }
        const payload = {'token': cachedToken};

        return this.instance.post(this.ENDPOINTS.tokenVerify, payload).then((response) => {
            if (response.status == 200) {
                apiInstance.refreshToken();
                return this.getUserDetail();
            } else {
                return Promise.reject("Invalid Token");
            }
        });
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

    async getStudents(): Promise<UserDetail[]> {
        const response = await this.instance.get(this.ENDPOINTS.students); 
        return response.data;
    }

    async getMeetings(cohortId: number): Promise<Meeting[]> {
        const params = { cohort: cohortId };
        const response = await this.instance.get(this.ENDPOINTS.meetings, { params });
        return response.data;
    }

    async editUser(pk: number, payload: Object) {
        const response = await this.instance.put(this.ENDPOINTS.users + pk + "/", payload)
        return response.data;
    }

    async deleteUser(pk: number) {
        const response = await this.instance.delete(this.ENDPOINTS.users + pk + "/")
        return response.data;
    }

    async deleteCohort(id: number) {
        const response = await this.instance.delete(this.ENDPOINTS.cohorts + id + "/")
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

    async getSubmissions(): Promise<Submission[]> {
        const params = { }
        const response = await this.instance.get(this.ENDPOINTS.submissions, { params });
        return response.data;
    }

    async createSubmission(payload: any): Promise<Submission> {
        const response = await this.instance.post(this.ENDPOINTS.submissions, payload);
        return response.data;
    }

    async gradeSubmission(payload: number): Promise<Submission> {
        const response = await this.instance.patch(this.ENDPOINTS.submissions, payload);
        return response.data;
    }

    async getAnnouncements(cohortId: number): Promise<Announcement[]> {
        const params = { cohort: cohortId };
        const response = await this.instance.get(this.ENDPOINTS.announcements, { params });
        return response.data;
    }
}

const apiInstance = new ApiWrapper();
export default apiInstance