import React, { useState, useRef } from 'react';
import Select from 'react-select';
import 'reactjs-popup/dist/index.css';
import {Button, Col, Modal, Form, Drawer, Checkbox, Avatar, Input, Row, Typography, Divider, DatePicker, TimePicker, InputNumber} from "antd";
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

    const [name, setName] = useState("");



    const [description, setDescription] = useState("<p>This is the initial content of the editor.</p>")

    const [badges, setBadges] = useState(available_badges);
    const [selectedBadges, setSelectedBadges] = useState([]);

    const [points, setPoints] = useState(0);

    const [date, setDate] = useState(moment());
    const [time, setTime] = useState(moment());

    const [files, setFiles] = useState([{value: null, label: null, id: 0}]);

    const output = [name, description, badges, points, date, time, files];

    const editorRef = useRef<any>(null);

    const addNewFile = () => {
        setFiles(files => [...files, {value: null, label: null, id: files.length}]);
    }

    const removeLastFile = () => {
        if (files.length == 1) {
            alert("Cannot remove file requirement. Only one file remains.")
        } else {
            setFiles(files=> files.slice(0, files.length - 1))
        }
    }
    
    const changeName = (event: { target: HTMLInputElement; }) => {
        setName(event.target.value);
    }

    const changeDate = (datey: any, dateString: any) => {
        setDate(datey);
    }

    const changeTime = (timey: any, timeString: any) => {
        setTime(timey);
    }

    function changePoints(value: any) {
        setPoints(value);
    }

    function changeDescription(value: any) {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
          }
    }

    function cancelPost() {
        alert("Are you sure you would like to discard this assignment?");
    }
    function checkForms(output: Array<any>) {
        console.log(output);
        var name, description, badges, points, date, time, files;
        [name, description, badges, points, date, time, files] = output;
        if (name == null || name == "") {
            alert("Must Complete 'Assignment Name' Field'");
            return false;
        }
        if (description == null || description == "") {
            alert("Must Complete 'Assignment Description' Field'");
            return false;
        }
        // No requirement for bagdes
    
        if (points == null || points == NaN) {
            alert("Must Complete 'Points' Field'");
            return false;
        }
        if (date == null) {
            alert("Must Complete 'Date' Field'");
            return false;
        }
        if (time == null) {
            alert("Must Complete 'Time' Field'");
            return false;
        }
        if (files == null || files == []) {
            alert("Must Complete 'Files' Field'");
            return false;
        } else {
            files.forEach((file: any) => {
                if (file.label == null || file.label == "") {
                    alert("Must Complete 'Files' Field'");
                    return false;
                }
                if (file.value == null || file.value == "") {
                    alert("Must Complete 'Files' Field'");
                    return false;
                }
                if (file.id == null || file.id == NaN || file.id < 0) {
                    alert("Must Complete 'Files' Field'");
                    return false;
                }
            });
        }
        return true;
    }

    const submitPost = (output: any) => () => {
        const op = checkForms(output);
        if (op) {
            alert("Assignment Posted!");
        }
    }

    console.log(description);

    const format = 'HH:mm';
    return (<>
        <Row>
            <Col span={12} offset={6}>
                <Divider orientation="left">Assignment Name</Divider>
                <input type="text" value={name} onChange={changeName}/>

                <Divider orientation="left">Assignment Description</Divider>
                <Editor
                    onInit={(evt, editor: any) => editorRef.current = editor}
                    initialValue="<p>This is the initial content of the editor.</p>"
                    onChange={changeDescription}
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
                <InputNumber min={1} max={1000} defaultValue={0} onChange={changePoints} />

                <Divider orientation="left">Add Badge Rewards</Divider>
                <BadgesSelector badges={badges} selected={selectedBadges} setSelectedBadges={setSelectedBadges}/><br/>
                <BadgesDisplay badges={badges} selected={selectedBadges}/><br/>

                <Divider orientation="left">Due Date and Time</Divider>
                <DatePicker onChange={changeDate}/>
                <TimePicker defaultValue={moment('23:59', format)} 
                            format={format} 
                            onChange={changeTime}/>

                <Divider orientation="left">Add File Requirements</Divider>
                <Button onClick={() => removeLastFile()} disabled={files.length == 1}>-</Button>
                <Button onClick={() => addNewFile()} disabled={files.length == 3}> + </Button>
                <RequiredFileList files={files} setFiles={setFiles}/>
                <Button onClick={cancelPost}> Cancel </Button>
                <Button onClick={submitPost(output)} > Post </Button>
            </Col>
        </Row>
        </>
    );
}


function RequiredFileList(props: any) {
    const files = props.files;
    const setFiles = props.setFiles;


    const onLabelChange = (index: number) =>  (event: any) => {
        const filesCopy = [...files];
        filesCopy[index].label = event.target.value;
        setFiles(filesCopy);
    }

    const onValueChange = (index: number) => (value: any) => {
        const filesCopy = [...files];
        filesCopy[index].value = value.value;
        setFiles(filesCopy);
    }

    const listItems =  files.map((file: any, index: number) =>
        <>
        <Form>
            <label>
                File Label: 
                <input type="text" value={file.label} onChange={onLabelChange(index)}/>
            </label>
            <br/>
            <label>
                Accepted Submission Type: 
                <Select options={accepted_filetypes} onChange={onValueChange(index)}/> 
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
            <BadgesCheckbox badges={props.badges} 
                            selected={props.selectedBadges} 
                            setSelectedBadges={props.setSelectedBadges}/>
        </Drawer>
      </>
    );
};

function BadgesCheckbox(props: any) {
    function onChange(checkedValues: any) {
        props.setSelectedBadges(checkedValues);
    }
    const badgelist = []
    const rowlen = 3;
    for (let row = 0; row < props.badges.length; row += rowlen) {
        badgelist.push(
            <Row> 
                {props.badges.slice(row, Math.min(props.badges.length, row+rowlen)).map((badge: any) => (
                        <Col span={8}>
                            <Checkbox value={badge.id}><Avatar size={64} icon={<UserOutlined />} /> {badge.label}</Checkbox>
                        </Col>
                ))}
            </Row>
        );

    }

    return (
        <Checkbox.Group style={{ width: '100%' }} onChange={onChange}> {badgelist} </Checkbox.Group>
    );
}

function BadgesDisplay(props: any) {
    const selectedBadges = props.selected;
    const badgeList = props.badges;
    const listItems =  selectedBadges.map((badgeID: number) =>
        <>
            <Avatar size={64} icon={<UserOutlined />} /> {badgeList[badgeID].label}
        </>
    );

    return  (<>
        {listItems}
        </>
    );
}

export default CreateAssignment