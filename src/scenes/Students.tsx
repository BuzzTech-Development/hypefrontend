import React, { useState} from 'react';
import 'reactjs-popup/dist/index.css';
import {Button, Col, Avatar, Row, Input, Layout, Menu, Radio, Collapse, Descriptions} from "antd";
import { UserOutlined, TeamOutlined, SwapOutlined, CloseOutlined,SearchOutlined} from '@ant-design/icons';

import apiInstance from "utils/api";

import Danger from 'scenes/Danger';
import Message from 'scenes/Message';

const {Header, Footer, Sider,  Content} = Layout;
const {Panel} = Collapse;

const temp_students = [
    {id: 0, lname: "Beans", fname: "Billy"},
    {id: 1, lname: "Sausage", fname: "Sally"},
    {id: 2, lname: "Lobster", fname: "Larry"},
    {id: 3, lname: "Pancake", fname: "Peter"},
    {id: 4, lname: "Macaroni", fname: "Mandy"}
]

const temp_cohorts = [
    {id: 0, name: "General", students: [0, 1, 2, 3, 4]},
    {id: 1, name: "Dum Dums", students: [0, 2, 4]},
    {id: 2, name: "The Average", students: [2, 3, 4]},
    {id: 3, name: "Loser", students: [3]},
    {id: 4, name: "GENIUS SQUAD", students: [0, 1, 2]}
]

const Students = () => {
    const [view, setView] = useState("student");
    const [sort, setSort] = useState("lname");
    const [reversed, setReversed] = useState(false);
    const [filter, setFilter] = useState("");


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

    const onSearch = (e: any) => {
        setFilter(e.target.value);
        console.log(e.target.value);
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
                        <Col>
                            <Input onChange={onSearch} suffix={<SearchOutlined/>} style={{ width: 200 }} />
                        </Col>
                        </Row>
                    <Row>
                        <Col span={18}>
                            <CurrentView view={view} sort={sort} reversed={reversed} filter={filter}/>
                        </Col>
                    </Row>
                </Col>

    </>
    );
}

function CurrentView(props: any) {

    const deleteCohort = () => {
        console.log("Delete Cohort");
    }

    var output = (<></>);
    // Temp subset/sorted students 
    var sub_students = [...temp_students];
    var sub_cohorts = [...temp_cohorts];

    // Filter
    if (props.filter != "") {
        const regexp = new RegExp(".*" + props.filter + ".*", 'i');
        sub_students = sub_students.filter((student) => {
            if (regexp.test(student.fname) ||
                regexp.test(student.lname) ||
                regexp.test(student.fname + " " + student.lname) ||
                regexp.test(student.lname + " " + student.fname)) {
                    return true;
                } else {
                    return false;
                }
        });

        sub_cohorts = sub_cohorts.filter((cohort) => {
            if (regexp.test(cohort.name)) {
                    return true;
                } else {
                    return false;
                }
        });
    }
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

    // Reverse
    if (props.reversed) {
        sub_students.reverse();
        sub_cohorts.reverse();
    }

    if (props.view == "student") {
        output = (<>
            <Collapse>
                {sub_students.map((student) => student_panel(student))}
            </Collapse>

        </>);
    } else if (props.view == "cohort") {
        output = (<>
            <Collapse>
                {sub_cohorts.map((cohort) => 
                    <Panel key={cohort.id} header={cohort.name}>
                        <Message to={cohort.name}/>
                        <Danger action="Delete Cohort" callback={deleteCohort} icon={<CloseOutlined/>}/>
                        <Collapse>

                            {cohort.students.map((id) => student_panel(temp_students.find((t_student) => t_student.id === id)))}
                        </Collapse>
                    </Panel>
                )}
            </Collapse>
        </>);
    }
    return output;
}

const student_panel = (student: any) => {
    const deleteUser = () => {
        console.log("deleteus");
    }
    const changeCohort = () => {
        console.log("Change Cohort");
    }
    return (<>
            <Panel  key={student.id} 
                    header={ (<><Avatar size="default" icon={<UserOutlined/>}/> <b> {student.fname} {student.lname} </b></>)}
            >
                <Descriptions title="User Info" column={1} bordered>
                    <Descriptions.Item label="Email">xXxf0rtn1t3_l0v3rxXx@hotmail.com</Descriptions.Item>
                    <Descriptions.Item label="Cohort">Advanced Cohort</Descriptions.Item>
                    <Descriptions.Item label="Guardian E-mail">mom@moms.com</Descriptions.Item>

                </Descriptions>
                <Message to={student.fname + " " + student.lname}/>
                <Button onClick={changeCohort} icon={<TeamOutlined/>}>Change Cohort</Button>
                <Danger action="Delete User" callback={deleteUser} icon={<CloseOutlined/>}/>

            </Panel>
    </>);
}





export default Students;