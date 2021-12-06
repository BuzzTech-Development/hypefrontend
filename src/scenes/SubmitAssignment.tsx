import {withRouter} from "react-router-dom";
import React, {useState} from "react";
import ReactQuill from "react-quill";
import {Button, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {useAppDispatch} from "../redux/store";
import {createSubmission} from "../redux/assignmentSlice";
import { count } from "console";

const SubmitAssignment = (props: any) => {
    const {assignment, onSubmit} = props;
    const [description, setDescription] = useState('');
    const [fileList, updateFileList] = useState<any[]>([]);
    //const [errors, setErrors] = useState(Array(assignment.num_files).fill(''));
    const dispatch = useAppDispatch();

    const checkFileTypes = () => {
        let fileExtensions = fileList.slice();
        for (let i = 0; i < fileExtensions.length; i++) {
            const index = (fileExtensions[i] as any).name.lastIndexOf(".");
            fileExtensions[i] = (fileExtensions[i] as any).name.slice(index);
        }
        fileExtensions = fileExtensions.sort();
        const requiredExtensions = assignment.file_extensions.slice().sort();
        if (fileExtensions.join(',') === requiredExtensions.join(',')) return true;
        
        // invalid file types
        const counts = {}
        for (const i in requiredExtensions) {
            const extension = requiredExtensions[i];
            (counts as any)[extension] = ((counts as any)[extension] || 0) + 1;
        }
        let errorStr = 'Submission does not include the correct file types. The submission requires ';
        const keys = Object.keys(counts);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (i === 0) {
                errorStr += (counts as any)[key] + ' ' + key + ' file' + ((counts as any)[key] === 1 ? '' : 's');
                continue;
            }
            if (keys.length > 2) errorStr += ',';
            if (i === keys.length - 1) errorStr += ' and';
            errorStr += ' ' + (counts as any)[key] + ' ' + key + ' file' + ((counts as any)[key] === 1 ? '' : 's');
        }
        errorStr += '.';
        alert(errorStr);
        return false;
    };

    const tableSpace = {
        width: '3em'
    };

    const submitAssignment = () => {
        if (!checkFileTypes()) return;
        const formData = new FormData();
        formData.append('assignment', assignment.id);
        formData.append('comments', description);
        formData.append('graded', 'false');
        fileList.forEach(file => {
            formData.append('files', file);
        });
        dispatch(createSubmission(formData));
        alert('Submission has been uploaded.');
        onSubmit();
    }

    const uploadProps = {
        onRemove: (file: any) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            updateFileList(newFileList);
        },
        beforeUpload: (file: any) => {
            updateFileList(oldArr => [...oldArr, file]);
            return false;
        },
        fileList,
        maxCount: assignment.file_extensions.length,
        style: tableSpace
    };
  
    return (
        <>
            <h3>Submission Comments</h3>
            <ReactQuill value={description} onChange={setDescription} />
            <br/>
            <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            <br/>
            <Button onClick={submitAssignment} type="primary">Submit</Button>
        </>
    )
}

export default withRouter(SubmitAssignment);