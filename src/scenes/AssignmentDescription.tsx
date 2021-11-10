import { PageHeader, Divider, Upload, Space, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { withRouter, useParams } from "react-router-dom";
import {Assignment, assignmentsSelectors} from "../redux/assignmentSlice";
import store from "../redux/store";
import moment from 'moment';

const AssignmentDescription = (props: any) => {
    const {id} = useParams<{id? : any}>();
    const assignment: Assignment | undefined = assignmentsSelectors.selectAll(store.getState()).find(val => val.id?.toString() === id);
    const [errors, setErrors] = useState(Array(assignment?.num_files).fill(''))
    let dueDate;
    let dueTime;
    if (assignment && !assignment.undated) {
        dueDate = new Date(assignment?.due_date).toLocaleDateString("en-US", { day: 'numeric', month: 'long' })
        dueTime = new Date(assignment?.due_date).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit'})
    } else {
        dueDate = null;
        dueTime = null;
    }
    const tableSpace = {
        width: '3em'
    }

    const checkFileType = (info: any, i: any) => {
        return;
        // does not work until file extensions are fixed
        /*
        let extension = info.file.name.split('.').pop();
        let temp = errors.slice();
        if (info.fileList.length === 0) {
            temp[i] = '';
            setErrors(temp);
        } else if (assignment.files[i].extension !== extension) {
            // maybe also remove file
            temp[i] = 'Error. File type must be ' + assignment.files[i].type + '.';
            setErrors(temp);
        }
        */
    }

    const submitAssignment = () => {
        if (assignment === undefined) return;
        let valid = true;
        for (let i = 0; i < assignment.num_files; i++) {
            if (errors[i] !== '') {
                valid = false;
                break;
            }
        }
        if (valid) alert("Assignment submitted!");
        else alert("Cannot submit assignment.");
    }

    return (<Space direction='vertical' style={{width: '100%', paddingLeft: '2em'}}>
        <Space direction='horizontal'>
            <PageHeader title={assignment?.name} style={{padding: '1em 0 0 0'}} />
            <div style={{padding: '1em 0 0 0'}}>
                <Button onClick={submitAssignment}>Submit Assignment</Button>
            </div>
        </Space>
        <Divider orientation='left' />
        <Space direction='horizontal' size='large'>
            {assignment?.undated ? <></> : <div><b>Due:</b> {dueDate} at {dueTime}</div>}
            <div><b>Points:</b> {assignment?.points}</div>
            <div><b>Required Files:</b> {assignment?.num_files}</div>
            {assignment?.badge !== -1 ? <div><b>Badge:</b> {assignment?.badge}</div> : <></>}
        </Space>
        <Divider />
        {typeof assignment?.description === 'undefined' ? <></> : <div dangerouslySetInnerHTML={{__html: assignment?.description}}></div>}
        <Upload maxCount={assignment?.num_files} onChange={(info: any) => checkFileType(info, 0)} style={tableSpace}>
            <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
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