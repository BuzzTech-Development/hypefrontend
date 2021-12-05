import { PageHeader, Divider, Upload, Space, Button } from 'antd';
import React, {useEffect, useState} from 'react';
import {withRouter, useParams, Link} from "react-router-dom";
import {Assignment, assignmentsSelectors, Submission} from "../redux/assignmentSlice";
import store, {useAppSelector} from "../redux/store";
import SubmitAssignment from "./SubmitAssignment";
import SubmissionHistoryTable from "./SubmissionHistoryTable";

const AssignmentDescription = (props: any) => {
    const {id} = useParams<{id? : any}>();
    const assignment = assignmentsSelectors.selectAll(store.getState()).find(val => val.id?.toString() === id);
    const currentUser = useAppSelector((state) => state.user.userDetail);
    const userId = currentUser?.pk;

    const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submissions, updateSubmissions] = useState<Submission[]>([]);

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

    const handleSubmit = () => {
        setSubmitted(true);
        setIsSubmittingAssignment(false);
    }

    useEffect(() => {
        const submissions = assignment?.submissions.filter((submission: Submission) => submission.author === userId);
        if (submissions && submissions.length > 0) {
            setSubmitted(true)
            updateSubmissions(submissions)
        }

    }, [assignment])

    if (!assignment) return null;
    const submitText = submitted ? "Resubmit Assignment" : "Submit Assignment";

    return (<Space direction='vertical' style={{width: '100%', paddingLeft: '2em'}}>
        <Space direction='horizontal'>
            <PageHeader title={assignment.name} style={{padding: '1em 0 0 0'}} />
            <div style={{padding: '1em 0 0 0'}}>
                <Button onClick={() => setIsSubmittingAssignment(true)}>{submitText}</Button>
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
        {typeof assignment.description === 'undefined' ? null : <div dangerouslySetInnerHTML={{__html: assignment.description}}></div>}
        {isSubmittingAssignment ? <SubmitAssignment assignment={assignment} onSubmit={handleSubmit}/> : null}
        {submitted ? <SubmissionHistoryTable submissions={submissions}/> : null}
    </Space>)
}

export default withRouter(AssignmentDescription);