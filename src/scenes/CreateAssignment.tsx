import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import Select from 'react-select';
import 'reactjs-popup/dist/index.css';
import {Button, Col, Form, Drawer, Radio, Avatar, Input, Row, Divider, DatePicker, TimePicker, InputNumber } from "antd";
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useAppDispatch} from "../redux/store";
import {createAssignment, Assignment} from "../redux/assignmentSlice";

const accepted_filetypes = [
    {value: 'pdf', label: 'pdf'},
    {value: 'docx', label: 'docx'},
    {value: 'zip', label: 'zip'},
    {value: 'png', label: 'png'},
    {value: 'txt', label: 'txt'}
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

const CreateAssignment = (props: any) => {
    const [files, setFiles] = useState(1);
    const [visible, setVisible] = useState(false);
    const dispatch = useAppDispatch();

    const onFinish = (values: any) => {
        // validate date and time
        const date = values.date.format('MM/DD/YYYY');
        const time = values.time.format('HH:mm');
        const dateTime = moment(date + ' ' + time, 'MM/DD/YYYY HH:mm');
        if (dateTime < moment()) {
            // probably want a better error message
            alert("Due date cannot be before current time.");
            return;
        }

        // populate files array
        let files = [];
        let i = 0;
        while (values['filelabel' + i]) {
            files.push({
                extension: values['filetype' + i]['value'],
                type: values['filetype' + i]['label']
            })
            i++;
        }

        // will want to be able to include attachments to assignment (ex: starter code)
        const assignment : Assignment = {
            name: values.name,
            createdAt: moment(),
            points: values.points,
            dueDate: dateTime,
            graded: false,
            numFiles: files.length
        }
        if (values.description) assignment.description = values.description; // HTML INSERTION PROBABLY POSSIBLE HERE, SHOULD SANITIZE
        if (values.selectedBadge) assignment.badge = values.selectedBadge;

        dispatch(createAssignment(assignment));

        // DISPATCH FILES TO TABLE
        // TABLE SHOULD BE ONE ASSIGNMENT TO MANY FILES

        console.log('Success:', assignment);
        props.history.push('/assignments');
    };

    const cancelAssignment = () => {
        if (window.confirm("Are you sure you would like to discard this assignment?")) {
            props.history.push('/assignments');
        }
    }

    function disabledDate(current: any) {
        return current <= moment().subtract(1, 'days').endOf('day');
    }

    return (<Form layout="vertical" onFinish={onFinish} initialValues={{
            description: '',
            points: 1,
            date: moment().add(1, 'weeks'),
            time: moment().endOf('day')}}>
        <Divider orientation="left">Description</Divider>
        <Form.Item label="Assignment Name" name="name" rules={[{ required: true, message:"Assignment name required." }]}>
            <Input type="text" placeholder="Assignment name" />
        </Form.Item>
        <Form.Item label="Assignment Description" name="description">
            <ReactQuill theme="snow" />
        </Form.Item>

        <Divider orientation="left">Rewards</Divider>
        <Row justify="center">
            <Form.Item label="Point Value" name="points" rules={[{ required: true, message:"Point value  required." }]}>
                <InputNumber min={1} max={1000} />
            </Form.Item>
        </Row>
        <Row justify="center">
            <Button type="primary" onClick={() => setVisible(true)}>Select Badge</Button>
            <Drawer title="Select a Badge" placement="bottom" onClose={() => setVisible(false)} visible={visible} height={500}>
                <Form.Item name="selectedBadge">
                    <Radio.Group> 
                        {available_badges.map((badge: any) => (
                            <Radio key={badge.id} value={badge.id}>
                                <Avatar size={64} icon={<UserOutlined />} />
                                {badge.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>
            </Drawer>
        </Row>

        <Divider orientation="left">Due Date and Time</Divider>
        <Row justify="center">
            <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Due date required.', type: 'object' }]}>
                <DatePicker format="MM/DD/YYYY" disabledDate={disabledDate} />
            </Form.Item>
            <Form.Item label="Time" name="time" rules={[{ required: true, message: 'Due time required.', type: 'object' }]}>
                <TimePicker format="HH:mm"/>
            </Form.Item>
        </Row>
        
        <Divider orientation="left">File Requirements</Divider>
        <Row justify="center">
            <Button onClick={() => {setFiles(files - 1)}} disabled={files === 1}>-</Button>
            <Button onClick={() => {setFiles(files + 1)}} disabled={files === 3}> + </Button>
        </Row>
        <RequiredFileList files={files} setFiles={setFiles}/>

        <Divider />
        <Row justify="center">
            <Button onClick={cancelAssignment}> Cancel </Button>      
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
        </Row>
    </Form>);
}


function RequiredFileList(props: any) {
    const files = props.files;

    const listItems = [];
    for (var i = 0; i < files; i++) {
        listItems.push(<Row key={i}>
            <Col span={6}>
                <Row justify="center" align="middle" style={{ height: "100%" }}><b>File #{i + 1}</b></Row>
            </Col>

            <Col span={1}><Divider type="vertical" style={{ height: "100%" }}/></Col>

            <Col span={17}>
                <Form.Item label="File Label" name={"filelabel" + i} rules={[{ required: true, message:"File label required." }]}>
                    <Input type="text" placeholder="File label" />
                </Form.Item>
                <Form.Item label="Accepted Submission Type" name={"filetype" + i} rules={[{ required: true, message:"File type required." }]}>
                    <Select options={accepted_filetypes} name={"filetype" + i}/> 
                </Form.Item>
            </Col>
        </Row>);
    }

    return (<>
        {listItems}
    </>);
};

export default withRouter(CreateAssignment);