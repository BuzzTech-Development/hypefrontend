import {Submission} from "../redux/assignmentSlice";
import React, {useEffect, useState} from "react";
import {Table} from "antd";

const SubmissionHistoryTable = (props: any) => {
    const {submissions} = props;
    const [tableData, updateTableData] = useState<any[]>([]);

    const formatDate = (date: string) => {
        const day = date !== '' ? new Date(date).toLocaleDateString("en-US", { day: 'numeric', month: 'long' }): '';
        const time = date !== '' ? new Date(date).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit'}) : '';
        return day + " at " + time;
    }

    const columns = [
        {
            title: 'Submission',
            dataIndex: 'key',
            key: 'submission',
        },
        {
            title: 'Submitted Date',
            dataIndex: 'submittedDate',
            key: 'submittedDate',
        },
        {
            title: 'File',
            key: 'file',
            dataIndex: 'file',
            render: (text: any, record: any) => {
                return (
                    <a href={record.files.length > 0 ? record.files[0].file : null}>Download</a>
                );
            },
        },
    ];

    useEffect(() => {
        submissions.map((submission: Submission, i: any) => {
            const dataValue = {
                key: i + 1,
                submittedDate: formatDate(submission.time),
                files: submission.files
            };
            updateTableData(oldArr => [dataValue, ...oldArr])
        });
    }, [])



    return <div>
        <h2>Submission History:</h2>
        <Table columns={columns} dataSource={tableData} />
    </div>;
}

export default SubmissionHistoryTable;