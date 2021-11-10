import apiInstance from "../utils/api";
import {RootState} from "./store";

export interface Submission {
    assignment: number;
    comments: string;
    points: number;
    student: number;
}