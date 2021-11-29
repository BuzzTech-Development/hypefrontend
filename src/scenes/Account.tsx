import React, { useState} from 'react';
import 'reactjs-popup/dist/index.css';
import {Button, Col, Avatar, Row, Menu, Collapse, Descriptions, Upload, message, Space, Modal, Form, Input} from "antd";
import { UserOutlined, UploadOutlined, InfoOutlined, SettingOutlined, EditOutlined, LockOutlined} from '@ant-design/icons';

import apiInstance from "utils/api";
import { UserDetail} from 'redux/userSlice';

import Danger from 'scenes/Danger';
import Message from 'scenes/Message';

const {Panel} = Collapse;

const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

var view : string, setView : Function,
    user: UserDetail | undefined, setUser: Function;

const Account = () => {
    [view, setView] = useState("info");

    [user, setUser] = useState<UserDetail>();

    const handleClick = (key: any) => {
        setView(key.key);
    }

    const asyncGetUser = async () => {
        // Not sure what best practice is here
        const t_user : UserDetail = await apiInstance.getUserDetail();
        setUser(t_user);
    }

    if (user === undefined) {
        asyncGetUser();
    }

    return (<>
        <Col span={24}>
            <Row>
                <Menu onClick={handleClick} selectedKeys={[view]} mode="horizontal">
                    <Menu.Item key="info" icon={<InfoOutlined />}>
                        Info
                    </Menu.Item>
                    <Menu.Item key="settings" icon={<SettingOutlined />}>
                        Settings
                    </Menu.Item>
                </Menu>
            </Row>
            <Row justify="center">
                <Col span={12}>
                    <View/>
                </Col>
            </Row>
        </Col>
    </>)
}
const ChangeForm = () => {

}

const View = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedAttr, setSelectedAttr] = useState("");
    const [valueA, setValueA] = useState("");
    const [valueB, setValueB] = useState("");

    const changeA = (e: any) => {
        setValueA(e.target.value);
    }
    const changeB = (e: any) => {
        setValueB(e.target.value);
    }

    const showModal = (attr: string) => () => {
        setSelectedAttr(attr);
        setValueA("")
        setValueB("")
        setModalVisible(true);
    };

    const handleCancel = () => {
        setSelectedAttr("");
        setModalVisible(false);
    };

    const changeAttr = () => {
        // Also need to talk to David about changing passwords
        if (user != undefined) {
            if (valueA != valueB) {
                message.error(capitalize(selectedAttr) + "s not equal" );
                return;
            }
            if (valueA == "") {
                message.error(capitalize(selectedAttr) + " cannot be empty");
                return;
            }
            if (selectedAttr === "password") {
                
            }
            var temp_user: UserDetail | undefined = user;
            // This is gross, but typescript won't let me index this object dynamically
            if (selectedAttr == "username") {
                temp_user["username"] = valueA;
            } else if (selectedAttr == "password") {
                temp_user["password"] = valueA;
            }
            setUser(temp_user);
            apiInstance.editUser(temp_user.pk, temp_user);
        }
        setModalVisible(false);

    }

    const capitalize = (str: string) => {
        const lower = str.toLowerCase();
        const first = lower.charAt(0);
        return first.toUpperCase() + lower.slice(1);
    }

    if (view === "info" && user != undefined) {
        return (<>
            <Row align="middle">
                <Col>
                    <Avatar size={128} icon={<UserOutlined/>}></Avatar>
                </Col>
                <Col >
                      <Upload {...props}>
                            {/* Need to figure out how to use s3 with this */}
                            <Button icon={<UploadOutlined />}>Change Avatar</Button>
                        </Upload>
                </Col>
            </Row>
            <Row>
                <Descriptions column={2} title="User Info" bordered>
                    <Descriptions.Item label="Username">
                        <Space align="center" size="large">
                            <Col> {user.username} </Col>
                            <Col> <Button icon={<EditOutlined/>} onClick={showModal("username")}></Button> </Col>
                        </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="First Name">{user.first_name}</Descriptions.Item>
                    <Descriptions.Item label="Last Name">{user.last_name}</Descriptions.Item>
                    <Descriptions.Item label="E-Mail">{user.email}</Descriptions.Item>
                    <Descriptions.Item label="Role">{user.profile === null || user.profile === undefined ? "" : (user.profile.role as string)}</Descriptions.Item>
                    <Descriptions.Item label="No. Of Badges">1234</Descriptions.Item>
                    <Descriptions.Item label="Password"> 
                    <Space align="center" size="large">
                        <Col>********</Col>
                        <Col><Button icon={<EditOutlined/>} onClick={showModal("password")}></Button></Col>
                    </Space>
                    </Descriptions.Item>
                </Descriptions>
            </Row>
            <Modal title={"Change " + capitalize(selectedAttr)} visible={isModalVisible} onOk={changeAttr} onCancel={handleCancel}>

                <Input
                    type={selectedAttr === "password" ? "password" : ""}
                    placeholder={capitalize(selectedAttr)}
                    onChange={changeA}
                    value={valueA}
                />
                <Input
                    type={selectedAttr === "password" ? "password" : ""}
                    placeholder={"Confirm " + capitalize(selectedAttr)}
                    onChange={changeB}
                    value={valueB}
                />

            </Modal>
        </>);
    } else if (view === "settings") {
        return <></>;
    } else {
        return <></>
    }
}

export default Account;