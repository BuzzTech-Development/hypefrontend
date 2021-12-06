import {withRouter} from "react-router-dom";
import React, {useState} from "react";
import ReactQuill from "react-quill";
import {Button, InputNumber} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {useAppDispatch} from "../redux/store";
import {gradeSubmission} from "../redux/assignmentSlice";
import {getMostRecentSubmission} from "../utils/utils";

const GradeAssignment = (props: any) => {
    const {assignment, studentId, onSubmit} = props;
    const [comments, setComments] = useState('');
    const [points, setPoints] = useState(0)
    const dispatch = useAppDispatch();


    const tableSpace = {
        width: '3em'
    };

    const submission = getMostRecentSubmission(assignment, studentId);
    console.log(studentId)
    console.log(submission)

    const gradeAssignment = () => {
        const payload = {
            submissionId: submission?.id,
            points: points,
        }
        dispatch(gradeSubmission(payload));
        onSubmit(points);
    }

    const setGrade = (points: any) => {
        if (points) setPoints(points);
    }

    return (
        <>
            <a href={submission?.files.length > 0 ? submission?.files[0].file : null}>Download</a>
            <br />
            <h3>Submission Comments</h3>
            <ReactQuill value={comments} onChange={setComments} />
            <br/>
            <InputNumber min={0} max={assignment.points} defaultValue={0} onChange={setGrade}/>
            <br/>
            <Button onClick={gradeAssignment} type="primary">Grade Assignment</Button>
        </>
    )
}

export default withRouter(GradeAssignment);