import {Button, List, Space, Table} from 'antd';
import React, {useEffect, useState} from 'react';
import { withRouter, Link } from "react-router-dom";
import {Assignment, assignmentsSelectors, Submission} from "../redux/assignmentSlice";
import store, {useAppSelector} from "../redux/store";
import {getMostRecentSubmission} from "../utils/utils";

const Grades = (props: any) => {
    const { student } = props;
    const assignments: Assignment[] = useAppSelector(assignmentsSelectors.selectAll);
    const [tableData, updateTableData] = useState<any[]>([]);
    const currentUser = useAppSelector((state) => state.user.userDetail);
    const userId = currentUser?.pk;

    const getMostRecentSubmission = (assignment: Assignment) => {
        const submissions = assignment.submissions.filter((submission: Submission) => submission.author === userId);
        if (submissions.length === 0) return null;
        return submissions[submissions.length-1];
    }

    const formatDate = (date: string) => {
        const day = date !== '' ? new Date(date).toLocaleDateString("en-US", { day: 'numeric', month: 'long' }): '';
        const time = date !== '' ? new Date(date).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit'}) : '';
        return day + " at " + time;
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: any, record: any) => <Link to={`/assignments/${record.id}`}>{text}</Link>,
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
        },
        {
            title: 'Submitted Date',
            dataIndex: 'submittedDate',
            key: 'submittedDate',
        },
        {
            title: 'Grade',
            key: 'grade',
            dataIndex: 'grade',
        },
    ];

    useEffect(() => {
        const submitted = assignments.filter((v: Assignment) => {
            const submissions = v.submissions.filter((submission: Submission) =>
                submission.author === userId
            );
            return submissions.length != 0;
        });

        submitted.map((assignment: Assignment, i:any) => {
            const submission = getMostRecentSubmission(assignment, student.pk);
            if (!submission) return null;
            const dataValue = {
                key: i,
                id: assignment.id,
                name: assignment.name,
                dueDate: formatDate(assignment.due_date),
                submittedDate: formatDate(submission.time),
                grade: submission.graded ? ((submission.points / assignment.points * 100).toFixed(2)).toString() + '%' : "Not yet graded"
            }
            updateTableData(oldArray =>[...oldArray, dataValue])
        })
    }, [])


    return (<Space direction='vertical' size='large' style={{width: '80%'}}>
            <Table columns={columns} dataSource={tableData} />
    </Space>)
}

export default withRouter(Grades);