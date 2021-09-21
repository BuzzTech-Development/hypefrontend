import React, { useState } from 'react';
import Select from 'react-select';
import {Button, Col, Form, Input, Row, Typography} from "antd";

import {useAppDispatch} from "redux/store";
import {login} from "redux/userSlice";

const accepted_filetypes = [
    {value: 'pdf', label: 'PDF'},
    {value: 'docx', label: 'DOCX'},
    {value: 'zip', label: 'zip'},
    {value: 'image', label: 'Image'},
    {value: 'text', label: 'Text'}
]


const CreateAssignment = () => {
    const dispatch = useAppDispatch();
    const [files, setFiles] = useState([{value: null, label: null, id: 0}]);
    console.log(files);

    const addNewFile = () => {
        console.log(files);
        const temp = files;
        temp.push({value: null, label: null, id: files.length});
        setFiles(temp);
    }
 

    return (<>
        <RequiredFileList files={files}/>
        <Button onClick={() => addNewFile()}> + </Button>
    </>);
}


function RequiredFileList(props: any) {
    const files = props.files;
    const listItems =  files.map((file: any) =>
        <li key={file.id}>
            <Form>
                <label>
                    File Label {file.value}: 
                    <input type="text"/>
                </label>
                <br/>
                <label>
                    Accepted Submission Type: 
                    <Select options={accepted_filetypes} /> 
                </label>
            </Form>
        </li>
    );

    return  (
        <ul>{listItems}</ul>
    );
};

export default CreateAssignment