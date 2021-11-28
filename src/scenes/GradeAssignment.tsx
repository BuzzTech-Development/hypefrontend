import {withRouter} from "react-router-dom";
import React, {useState} from "react";
import ReactQuill from "react-quill";
import {Button, InputNumber} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {useAppDispatch} from "../redux/store";
import {gradeSubmission} from "../redux/submissionSlice";

const GradeAssignment = (props: any) => {
    const {assignment} = props;
    const [comments, setComments] = useState('');
    const [points, setPoints] = useState(0)
    const dispatch = useAppDispatch();


    const tableSpace = {
        width: '3em'
    };

    const gradeAssignment = () => {
        dispatch(gradeSubmission(points));
    }

    const setGrade = (points: any) => {
        if (points) setPoints(points);
    }

    return (
        <>
            <DownloadOutlined>Download</DownloadOutlined>
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