import React, { useState, useRef } from 'react';
import 'reactjs-popup/dist/index.css';
import {Button, Col, Form, Drawer, Select, Avatar, Input, Row, Divider, DatePicker, TimePicker, InputNumber, Layout} from "antd";
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from '../../Home.module.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {useAppDispatch, useAppSelector} from "redux/store";
import {Assignment, createAssignment} from "../../../../redux/assignmentSlice";
import {ActiveView} from "./type";

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

interface CreateAssignmentProps {
    onChangeView: (activeView: ActiveView) => void;
}

const CreateAssignment = ({onChangeView}: CreateAssignmentProps) => {

    const dispatch = useAppDispatch();

    const [name, setName] = useState("");

    const [form] = Form.useForm()

    const [description, setDescription] = useState("<p>This is the initial content of the editor.</p>");

    const [points, setPoints] = useState(0);

    const [date, setDate] = useState(moment());
    const [time, setTime] = useState(moment());

    const [files, setFiles] = useState([{value: null, label: null, id: 0}]);



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


    const onFinish = (values: any) => {
        const fileList: any[] = [];
        const assignment: Assignment = {
            name: values.name,
            date: values.date.format("YYYY-MM-DD"),
            time: values.time.format("hh:mm"),
            description: values.description,
            points: values.points,
            selectedBadge: values.selectedBadge,
            graded: false,
            grade: 0
        }
        fileList.push({name: values.filename0, type: values.filetype0 })
        if (values.hasOwnProperty('filename1')) {
            fileList.push({name: values.filename1, type: values.filetype1})
        }
        if (values.hasOwnProperty('filename2')) {
            fileList.push({name: values.filename2, type: values.filetype2})
        }
        dispatch(createAssignment(assignment));
    };

    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
      };
      const onClose = () => {
        setVisible(false);
      };

    const badgelist = [];


    console.log(description);
    type SizeType = Parameters<typeof Form>[0]['size'];
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const onFormLayoutChange = ({ size }: { size: SizeType }) => {
      setComponentSize(size);
    };

    const format = 'HH:mm';
    return (<>
    <Layout className={styles.Home}>
        <Layout.Content className={styles.Content}>
            <Form
                wrapperCol={{ span: 24 }}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{name: "",
                                description: "",
                                points: 0,
                                selectedBadge: null,
                                date: moment(),
                                time: moment()}}
                onValuesChange={onFormLayoutChange}
                form={form}
            >

                    <Divider orientation="left">Description</Divider>
                    <Form.Item label="Assignment Name"
                                name="name"
                                rules={[{ required: true,
                                    message: 'Please input an Assignment Name!'}]}>
                        <Input type="text" value={name} onChange={changeName}/>
                    </Form.Item>
                    <Form.Item label ="Assignment Description"
                                name ="description"
                                rules={[{ required: true,
                                    message: 'Please input and Assignment Description!'}]}>
                        <ReactQuill theme="snow" value={description} />
                    </Form.Item>

                    <Divider orientation="left">Rewards</Divider>
                    <Row justify="center">
                        
                        <Form.Item label="Point Value" name="points">
                            <InputNumber min={1} max={1000}/>
                        </Form.Item>
                    </Row>
                    <Row justify="center">
                        <Form.Item label="Select a badge" name="selectedBadge">
                            <Select>
                                {available_badges.map((badge: any) => (<>
                                                    <Select.Option value={badge.id}><Avatar size={64} icon={<UserOutlined />} /> {badge.label}</Select.Option>
                                                    </>
                                ))}
                            </Select>
                        </Form.Item>
                    </Row>



                    {/* <Avatar size={64} icon={<UserOutlined />}/> {available_badges[form.getFieldValue("selectedBadge")].label}   */}

                    <Divider orientation="left">Due Date and Time</Divider>
                    <Row justify="center">
                        <Form.Item
                                    label="Date"
                                    name="date"
                                    rules={[{ required: true,
                                            message: 'Please input a due date!' }]}
                        >
                            <DatePicker onChange={changeDate}/>
                        </Form.Item>
                        <Form.Item
                                    label="Time"
                                    name="time"
                                    rules={[{ required: true,
                                            message: 'Please input a due time!' }]}
                        >
                            <TimePicker defaultValue={moment()} 
                                        format={format} 
                                        onChange={changeTime}/>
                        </Form.Item>
                    </Row>
                    

                    <Divider orientation="left"> File Requirements </Divider>

                    <Row justify="center">
                        <Button onClick={() => removeLastFile()} disabled={files.length == 1}>-</Button>
                        <Button onClick={() => addNewFile()} disabled={files.length == 3}> + </Button>
                    </Row>

                    <RequiredFileList files={files} setFiles={setFiles}/>

                    <Row justify="center">
                        <Button onClick={() => onChangeView('mainView')}> Cancel </Button>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                            Submit
                            </Button>
                        </Form.Item>
                    </Row>
                </Form>
            </Layout.Content>
        </Layout>
        </>
    );
}


function RequiredFileList(props: any) {
    const files = props.files;


    const listItems =  files.map((file: any, index: number) =>
    
        <>
        <Row>
            <Col span={6} >
                
                <Row justify="center" align="middle" style={{ height: "100%" }}><b>File #{index + 1}</b></Row>
            </Col>

            <Col span={1}><Divider type="vertical" style={{ height: "100%" }}/></Col>

            <Col span={17}>
                <Form.Item label="File Label"
                            name={"filename" + index}
                            rules={[{ required: true,
                                message: 'Please input a file label!'
                                 }]}>
                    <Input type="text" value={"filename" + index} />
                </Form.Item>
                <Form.Item label="Accepted Submission Type" 
                            name={"filetype" + index}
                            rules={[{ required: true,
                                message: 'Please input a file type'}]}>
                    <Select options={accepted_filetypes}/> 
                </Form.Item>
            </Col>

        </Row>
        <Divider></Divider>

        </>
    );

    return  (<>
        {listItems}
        </>
    );
};

export default CreateAssignment