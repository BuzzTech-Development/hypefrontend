import {useParams, withRouter} from "react-router-dom";
import React, {useState} from "react";
import ReactQuill from "react-quill";
import {Button, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {useAppDispatch, useAppSelector} from "../redux/store";
import {createSubmission, Submission} from "../redux/submissionSlice";
import moment from "moment";

const SubmitAssignment = (props: any) => {
    const {assignment} = props;
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState(Array(assignment.num_files).fill(''));
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.user.userDetail?.id);
    if (!userId) return null;

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
    };

    const tableSpace = {
        width: '3em'
    };

    const submitAssignment = () => {
        let valid = true;
        for (let i = 0; i < assignment.num_files; i++) {
            if (errors[i] !== '') {
                valid = false;
                break;
            }
        }
        const submission: Submission = {
            assignment: assignment.id,
            comments: description,
            points: assignment.points,
            student: userId,
            time: moment().toISOString()
        }
        dispatch(createSubmission(submission));
        if (valid) alert("Assignment submitted!");
        else alert("Cannot submit assignment.");
    }

    return (
        <>
            <h3>Submission Comments</h3>
            <ReactQuill value={description} onChange={setDescription} />
            <br/>
            <Upload maxCount={assignment.num_files} onChange={(info: any) => checkFileType(info, 0)} style={tableSpace}>
                <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            <br/>
            <Button onClick={submitAssignment} type="primary">Submit</Button>
        </>
    )
}

export default withRouter(SubmitAssignment);