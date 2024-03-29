import { PageHeader, Divider, Upload, Space, Button } from 'antd';
import React, {useEffect, useState} from 'react';
import {withRouter, useParams, Link} from "react-router-dom";
import {Assignment, assignmentsSelectors, Submission} from "../redux/assignmentSlice";
import store, {useAppSelector} from "../redux/store";
import SubmitAssignment from "./SubmitAssignment";
import {UserRole} from "../redux/userSlice";
import GradeAssignment from "./GradeAssignment";
import SubmissionHistoryTable from "./SubmissionHistoryTable";

const DOMPurify = require('dompurify')(window);

const AssignmentDescription = (props: any) => {
    const {assignmentId, studentId} = useParams<{assignmentId? : any, studentId? : any}>();
    const role = useAppSelector((state) => state.user.userDetail?.profile?.role);
    const assignment = assignmentsSelectors.selectAll(store.getState()).find(val => val.id?.toString() === assignmentId);
    const currentUser = useAppSelector((state) => state.user.userDetail);
    const isTeacher = currentUser?.profile?.role == UserRole.Instructor;
    const userId = isTeacher ? studentId : currentUser?.pk;
    const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submissions, updateSubmissions] = useState<Submission[]>([]);
    const [grade, setGrade] = useState(0);
    const [graded, setGraded] = useState(false);
    const [isGradingAssignment, setIsGradingAssignment] = useState(false);

    const formatDate = (date: string) => {
        const day = date !== '' ? new Date(date).toLocaleDateString("en-US", { day: 'numeric', month: 'long' }): '';
        const time = date !== '' ? new Date(date).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit'}) : '';
        return day + " at " + time;
    }

    const createFileList = (fileTypes: any) => {
        if (fileTypes.length === 1) return <>{fileTypes[0]}</>
        let stringList = "";
        for (let i=0; i< fileTypes.length-1;i++) {
            stringList += fileTypes[i] + ", ";
        }
        stringList += fileTypes[fileTypes.length-1];
        return stringList;
    }

    const handleStudentSubmit = () => {
        setSubmitted(true);
        setIsSubmittingAssignment(false);
    }

    const handleTeacherSubmit = (grade: number) => {
        setGrade(grade);
        setGraded(true);
        setIsGradingAssignment(false);
    }

    useEffect(() => {
        const submissions = assignment?.submissions.filter((submission: Submission) => submission.author == userId);
        if (assignment && submissions && submissions.length > 0) {
            setSubmitted(true);
            updateSubmissions(submissions);
            const latestSubmission = submissions[submissions.length-1];
            if (latestSubmission.graded) {
                setGrade(latestSubmission.points / assignment.points);
                setGraded(true);
            }
        }

    }, [assignment])

    if (!assignment) return null;
    const submitText = submitted ? "Resubmit Assignment" : "Submit Assignment";
    const gradeText = graded ? "Regrade Assignment" : "Grade Assignment";

    return (<Space direction='vertical' style={{width: '100%', paddingLeft: '2em'}}>
        <Space direction='horizontal'>
            <PageHeader title={assignment.name} style={{padding: '1em 0 0 0'}} />
            <div style={{padding: '1em 0 0 0'}}>
                {isTeacher ? (
                    userId ? <Button onClick={() => setIsGradingAssignment(true)}>{gradeText}</Button> : <></>
                ) : (
                    <Button onClick={() => setIsSubmittingAssignment(true)}>{submitText}</Button>
                )}
            </div>
        </Space>
        <Divider orientation='left' />
        <Space direction='horizontal' size='large'>
            {assignment.due_date === "" ? null : <div><b>Due:</b> {formatDate(assignment.due_date)}</div>}
            <div><b>Points: </b>
                {assignment.points}
            </div>
            <div><b>Accepted File Types: </b>
                {createFileList(assignment.file_extensions)}
            </div>
            {assignment.badge !== -1 ? <div><b>Badge: </b>
                {assignment.badge}
            </div> : null}
        </Space>
        <Divider />
        {typeof assignment.description === 'undefined' ? null : <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(assignment.description)}}></div>}
        {isSubmittingAssignment ? <SubmitAssignment assignment={assignment} onSubmit={handleStudentSubmit}/> : null}
        {role === "INSTRUCTOR" && isGradingAssignment ? <GradeAssignment assignment={assignment} studentId={studentId} onSubmit={handleTeacherSubmit}/> : null }
        {submitted ? <SubmissionHistoryTable submissions={submissions}/> : null}
    </Space>)
}

export default withRouter(AssignmentDescription);