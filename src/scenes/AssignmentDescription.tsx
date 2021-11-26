import { PageHeader, Divider, Upload, Space, Button } from 'antd';
import React, { useState } from 'react';
import { withRouter, useParams } from "react-router-dom";
import {Assignment, assignmentsSelectors} from "../redux/assignmentSlice";
import store from "../redux/store";
import SubmitAssignment from "./SubmitAssignment";

const AssignmentDescription = (props: any) => {
    const {id} = useParams<{id? : any}>();
    const assignment: Assignment | undefined = assignmentsSelectors.selectAll(store.getState()).find(val => val.id?.toString() === id);
    const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
    if (!assignment) return (<></>);
    let dueDate;
    let dueTime;
    if (assignment.due_date !== "") {
        dueDate = new Date(assignment.due_date).toLocaleDateString("en-US", { day: 'numeric', month: 'long' })
        dueTime = new Date(assignment.due_date).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit'})
    } else {
        dueDate = null;
        dueTime = null;
    }

    return (<Space direction='vertical' style={{width: '100%', paddingLeft: '2em'}}>
        <Space direction='horizontal'>
            <PageHeader title={assignment.name} style={{padding: '1em 0 0 0'}} />
            <div style={{padding: '1em 0 0 0'}}>
                <Button onClick={() => setIsSubmittingAssignment(true)}>Submit Assignment</Button>
            </div>
        </Space>
        <Divider orientation='left' />
        <Space direction='horizontal' size='large'>
            {assignment.due_date === "" ? null : <div><b>Due:</b> {dueDate} at {dueTime}</div>}
            <div><b>Points:</b> {assignment.points}</div>
            <div><b>Accepted File Types:</b>
                <ul>
                    {assignment.file_extensions.map(file => {
                        return <li>{file}</li>
                    })}
                </ul>
            </div>
            {assignment.badge !== -1 ? <div><b>Badge:</b> {assignment.badge}</div> : null}
        </Space>
        <Divider />
        {typeof assignment.description === 'undefined' ? null : <div dangerouslySetInnerHTML={{__html: assignment.description}}></div>}
        {isSubmittingAssignment ? <SubmitAssignment assignment={assignment}/> : null}
        {/*
            <table>
            <tr>
                {assignment.files.map(file => {
                    return <>
                        <td>{file.label}</td>
                        <td style={tableSpace}></td>
                    </>
                })}
            </tr>
            <tr>
                {assignment.files.map((file, i) => {
                    return <>
                        <td>
                            <Upload maxCount={1} onChange={(info: any) => checkFileType(info, i)}>
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        </td>
                        <td style={tableSpace}></td>
                    </>
                })}
            </tr>
            <tr>
                {assignment.files.map((file, i) => {
                    return <>
                        <td style={{wordWrap: 'break-word'}}>{errors[i]}</td>
                        <td style={tableSpace}></td>
                    </>
                })}
            </tr>
        </table>
        */}
    </Space>)
}

export default withRouter(AssignmentDescription);