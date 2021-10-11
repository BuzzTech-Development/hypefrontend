import React, { useState, useRef } from 'react';
import 'reactjs-popup/dist/index.css';
import {Button, Col, Form, Drawer, Select, Avatar, Input, Row, Divider, DatePicker, TimePicker, List, Layout, Menu, Radio} from "antd";

import { UserOutlined, TeamOutlined, SwapOutlined} from '@ant-design/icons';
import styles from '../Home.module.css';

import apiInstance from "utils/api";

import {useAppDispatch} from "redux/store";
import { isNullOrUndefined } from 'util';

const {Header, Footer, Sider,  Content} = Layout;
const { SubMenu } = Menu;

const temp_students = [
    {id: 0, lname: "Beans", fname: "Billy"},
    {id: 1, lname: "Sausage", fname: "Sally"},
    {id: 2, lname: "Lobster", fname: "Larry"},
    {id: 3, lname: "Pancake", fname: "Peter"},
    {id: 4, lname: "Macaroni", fname: "Mandy"}
]

const temp_cohorts = []

const Students = () => {
    const [view, setView] = useState("student");
    const [sort, setSort] = useState("lname");
    const [reversed, setReversed] = useState(false);


    const handleClick = (e: any) => {
        console.log('click ', e.key);
        setView(e.key);
    };

    const handleSortChange = (e: any) => {
        console.log('Sort ', e.target.value);
        setSort(e.target.value);
    }

    const toggleReverse = (e: any) => {
        setReversed(!reversed);
    }

    return (<>
                <Col span={24}>
                    <Row>
                        <Col span={4}>
                            <Menu onClick={handleClick} selectedKeys={[view]} mode="horizontal">
                                <Menu.Item key="student" icon={<UserOutlined />}>
                                    Students
                                </Menu.Item>
                                <Menu.Item key="cohort" icon={<TeamOutlined />}>
                                    Cohorts
                                </Menu.Item>
                            </Menu>
                        </Col>
                        <Col span={1}/>
                        <Col>
                            <Radio.Group   onChange={handleSortChange}>
                                <Radio.Button value="lname">Last Name</Radio.Button>
                                <Radio.Button value="fname">First Name</Radio.Button>
                                <Radio.Button value="cohort">Cohort</Radio.Button>
                            </Radio.Group>
                        </Col>
                        <Col>
                            <Button onClick={toggleReverse} icon={<SwapOutlined/>} target="reverse order"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={18}>
                            <CurrentView view={view} sort={sort} reversed={reversed}/>
                        </Col>
                    </Row>
                </Col>

    </>
    );
}

function CurrentView(props: any) {
    var output = (<></>);
    // Temp subset/sorted students 
    var sub_students = [...temp_students];
    // TODO: Create subset based on search query

    // Sort
    if (props.sort === "lname") {
        sub_students = sub_students.sort((student1, student2) => {return student1.lname.localeCompare(student2.lname)});
    } else if (props.sort === "fname") {
        sub_students = sub_students.sort((student1, student2) => {return student1.fname.localeCompare(student2.fname)});
    } else if (props.sort === "cohort") {
        // TODO: change this from 'id' to some cohort identifier
        sub_students = sub_students.sort((student1, student2) => {
            if (student1.id == student2.id) {
                return 0;
            } else if (student1.id < student2.id) {
                return -1;
            } else {
                return 1;
            }
        });
    }

    if (props.reversed) {
        sub_students.reverse();
    }

    // Temp subset/sorted cohorts
    var sub_cohorts;


    if (props.view == "student") {
        output = (<>
              <List
                itemLayout="horizontal"
                dataSource={sub_students}
                renderItem={student => (
                    <List.Item>
                        <List.Item.Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<a href="https://ant.design">{student.fname} {student.lname}</a>}
                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                    </List.Item>
                    )}
                />
        </>);
    } else if (props.view == "cohort") {
        output = (<>

        </>);
    }
    return output;
}





export default Students;