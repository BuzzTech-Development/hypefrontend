import React, { useState, useRef } from 'react';
import Select from 'react-select';
import 'reactjs-popup/dist/index.css';
import {Button, Col, Modal, Form, Drawer, Checkbox, Avatar, Input, Row, Typography, Divider, DatePicker, TimePicker} from "antd";
import { UserOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import moment from 'moment';



import {useAppDispatch} from "redux/store";
import {login} from "redux/userSlice";
import { setConstantValue } from 'typescript';


const accepted_filetypes = [
    {value: 'pdf', label: 'PDF'},
    {value: 'docx', label: 'DOCX'},
    {value: 'zip', label: 'zip'},
    {value: 'image', label: 'Image'},
    {value: 'text', label: 'Text'}
]

// TODO: move the actual badges somewhere else
const available_badges = [
    {id: 0, label: 'First Badge', img: 'something'},
    {id: 1, label: 'Second Badge', img: 'something'},
    {id: 2, label: 'Third Badge', img: 'something'},
    {id: 3, label: 'Fourth Badge', img: 'something'},
    {id: 4, label: 'Fifth Badge', img: 'something'},
    {id: 5, label: 'Sixth Badge', img: 'something'},
    {id: 6, label: 'Seventh Badge', img: 'something'},
    {id: 7, label: 'Eighth Badge', img: 'something'},
    {id: 8, label: 'Ninth Badge', img: 'something'}
]




const CreateAssignment = () => {
    const dispatch = useAppDispatch();
    const [files, setFiles] = useState([{value: null, label: null, id: 0}]);
    const [badges, setBadges] = useState(available_badges);
    const [name, setName] = useState("");
    const [points, setPoints] = useState(0);

    const editorRef = useRef<null>(null);
    const log = () => {
                        if (editorRef.current !== null) {
                            console.log(editorRef.current);
                        }
    };
    const addNewFile = () => {
        setFiles(files => [...files, {value: null, label: null, id: files.length}]);
    }

    console.log(badges);


    const removeLastFile = () => {
        if (files.length == 1) {
            alert("Cannot remove file requirement. Only one file remains.")
        } else {
            setFiles(files=> files.slice(0, files.length - 1))
        }
    }
    
    const updateName = (event: { target: HTMLInputElement; }) => {
        setName(event.target.value);
    }

    var tempVal = 0;
    const updatePoints = (event: { target: HTMLInputElement; }) => {
        const num = parseInt(event.target.value);
        if (num === NaN || num == null) {
            setPoints(0);
        } else {
            tempVal = num;
            setPoints(num);
        }
    }


    const format = 'HH:mm';
    const satisfiedFields = true;


    return (<>
        <Row>
            <Col span={12} offset={6}>
                <Divider orientation="left">Assignment Name</Divider>
                <input type="text" value={name} onChange={updateName}/>

                <Divider orientation="left">Assignment Description</Divider>
                <Editor
                    onInit={(evt, editor: any) => editorRef.current = editor}
                    initialValue="<p>This is the initial content of the editor.</p>"
                    init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | code |help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />

                <Divider orientation="left">Point Value</Divider>
                <input type="text"  value={tempVal} onChange={updatePoints}/>

                <Divider orientation="left">Add Badge Rewards</Divider>
                <BadgesSelector badges={badges}/><br/>

                <Divider orientation="left">Due Date and Time</Divider>
                <DatePicker/>
                <TimePicker defaultValue={moment('23:59', format)} format={format} />

                <Divider orientation="left">Add File Requirements</Divider>
                <Button onClick={() => removeLastFile()} disabled={files.length == 1}>-</Button>
                <Button onClick={() => addNewFile()} disabled={files.length == 3}> + </Button>
                <RequiredFileList files={files}/>
                <Button onClick={() => removeLastFile()}> Cancel </Button>
                <Button onClick={() => addNewFile()} disabled={!satisfiedFields}> Post </Button>

            </Col>
        </Row>
        </>
    );
}


function RequiredFileList(props: any) {
    const files = props.files;
    const listItems =  files.map((file: any) =>
        <>
        <Form>
            <label>
                File Label: 
                <input type="text" value={file.label}/>
            </label>
            <br/>
            <label>
                Accepted Submission Type: 
                <Select options={accepted_filetypes} value={file.value}/> 
            </label>
        </Form>
        <Divider/>
        </>
    );

    return  (<>
        {listItems}
        </>
    );
};

function BadgesSelector(props: any) {

    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
      setVisible(true);
    };
    const onClose = () => {
      setVisible(false);
    };
    return (
      <>
        <Button type="primary" onClick={showDrawer}>
          Open
        </Button>
        <Drawer title="Basic Drawer" placement="bottom" onClose={onClose} visible={visible} height={500}>
            <BadgesCheckbox badges={props.badges}/>
        </Drawer>
      </>
    );
};

function BadgesCheckbox(props: any) {
    function onChange(checkedValues: any) {
        console.log('checked = ', checkedValues);
    }
    const badgelist = []
    const rowlen = 3;
    for (let row = 0; row < props.badges.length; row += rowlen) {
        badgelist.push(
            <Row> 
                {props.badges.slice(row, Math.min(props.badges.length, row+rowlen)).map((badge: any) => (
                        <Col span={8}>
                            <Checkbox value={badge.label}><Avatar size={64} icon={<UserOutlined />} /> {badge.label}</Checkbox>
                        </Col>
                ))}
            </Row>
        );

    }

    return (
        <Checkbox.Group style={{ width: '100%' }} onChange={onChange}> {badgelist} </Checkbox.Group>
    );
}

export default CreateAssignment