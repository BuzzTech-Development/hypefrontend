import { PageHeader, Divider, Upload, Space, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { withRouter, useParams } from "react-router-dom";
import moment from 'moment';

const Assignment = (props: any) => {
    const {id} = useParams<{id? : any}>();
    // hard-coded assignment
    // should be fetched using id
    const assignment = {
        name: 'Exam 1',
        id: 913252,
        description: '<p>This exam is intended to monitor your comprehension over the first few weeks of this course. This exam will cover content through Chapter 7 of the textbook.</p><p>This exam is strictly <b>CLOSED-NOTES</b>. Making <i>any</i> attempt to collaborate with others will be viewed as an academic infraction and treated accordingly.</p><br><p><b>Good luck!</b></p>',
        points: 100,
        badge: null,
        dueDate: moment().add(1, 'weeks').add(3, 'hours'),
        files: [{
            label: 'completed_exam_1',
            extension: 'pdf',
            type: 'PDF'
        }]
    }
    const [errors, setErrors] = useState(Array(assignment.files.length).fill(''))
    const dueDate = assignment.dueDate ? assignment.dueDate.format('MMMM DD') : null
    const dueTime = assignment.dueDate ? assignment.dueDate.format('LT') : null
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
        let valid = true;
        for (let i = 0; i < assignment.files.length; i++) {
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
            <PageHeader title={assignment.name} style={{padding: '1em 0 0 0'}} />
            <div style={{padding: '1em 0 0 0'}}>
                <Button onClick={submitAssignment}>Submit Assignment</Button>
            </div>
        </Space>
        <Divider orientation='left' />
        <Space direction='horizontal' size='large'>
            <div><b>Due:</b> {dueDate} at {dueTime}</div>
            <div><b>Points:</b> {assignment.points}</div>
            <div><b>Required Files:</b> {assignment.files.length}</div>
            {assignment.badge ? <div><b>Badge:</b> {assignment.badge}</div> : <></>}
        </Space>
        <Divider />
        <div dangerouslySetInnerHTML={{__html: assignment.description}}></div>
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
        {/*<Row gutter={30} style={{width: '100%'}}>
            {assignment.files.map((file, i) => {
                return <Col><Space direction='vertical'>
                    <div>{file.label}</div>
                    <Upload maxCount={1} onChange={checkFileType}>
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                    <div style={{wordWrap: 'break-word'}}>{errors[i]}</div>
                </Space></Col>
            })}
        </Row>*/}
    </Space>)
}

export default withRouter(Assignment);