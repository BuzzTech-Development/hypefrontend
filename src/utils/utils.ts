import {Assignment, Submission} from "../redux/assignmentSlice";

export const getMostRecentSubmission = (assignment: Assignment, studentId: number) => {
    const submissions = assignment.submissions.filter((submission: Submission) => submission.author == studentId);
    if (submissions.length == 0) return null;
    return submissions[submissions.length-1];
}