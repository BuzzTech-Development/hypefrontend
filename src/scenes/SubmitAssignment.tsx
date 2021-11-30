import {withRouter} from "react-router-dom";
import React, {useState} from "react";
import ReactQuill from "react-quill";
import {Button, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {useAppDispatch} from "../redux/store";
import {createSubmission} from "../redux/assignmentSlice";

const SubmitAssignment = (props: any) => {
    const {assignment} = props;
    const [description, setDescription] = useState('');
    const [fileList, updateFileList] = useState<any[]>([]);
    //const [errors, setErrors] = useState(Array(assignment.num_files).fill(''));
    const dispatch = useAppDispatch();

    const checkFileType = (info: any, i: any) => {
        console.log(info);
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
        /*
        let valid = true;
        for (let i = 0; i < assignment.file_extensions.length; i++) {
            if (errors[i] !== '') {
                valid = false;
                break;
            }
        }
         */

        const formData = new FormData();
        formData.append('assignment', assignment.id);
        formData.append('comments', description);
        formData.append('graded', 'false');
        fileList.forEach(file => {
            formData.append('files', file);
        });
        dispatch(createSubmission(formData));
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