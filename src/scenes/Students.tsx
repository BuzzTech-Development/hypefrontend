import React, { useState} from 'react';
import 'reactjs-popup/dist/index.css';
import {Button, Col, Avatar, Row, Input, Layout, Menu, Radio, Collapse, Descriptions, Modal, Checkbox} from "antd";
import { UserOutlined, TeamOutlined, SwapOutlined, CloseOutlined,SearchOutlined, FormOutlined} from '@ant-design/icons';
import { useAppSelector } from 'redux/store';
import apiInstance from "utils/api";
import { UserDetail, Cohort } from 'redux/userSlice';
import Danger from 'scenes/Danger';
import Message from 'scenes/Message';
import {useSelector} from "react-redux";
import Grades from './Grades';
import { Link } from 'react-router-dom';

const {Panel} = Collapse;

var view : string, setView : Function, 
    sort : string, setSort : Function,
    reversed : boolean, setReversed : Function,
    filter : string, setFilter : Function,
    students : UserDetail[], setStudents : Function,
    cohorts : string[], setCohorts : Function;


const Students = () => {
    [view, setView] = useState("student");
    [sort, setSort] = useState("lname");
    [reversed, setReversed] = useState(false);
    [filter, setFilter] = useState("");

    const handleClick = (e: any) => {
        setView(e.key);
    };

    const handleSortChange = (e: any) => {
        setSort(e.target.value);
    }

    const toggleReverse = (e: any) => {
        setReversed(!reversed);
    }

    const onSearch = (e: any) => {
        setFilter(e.target.value);
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

    [students, setStudents] = useState<UserDetail []>([]);
    const cohorts = useAppSelector(state => state.user.userDetail?.profile?.cohorts || []);

    const asyncGetStudents = async () => {
        // Not sure what best practice is here
        const t_students : UserDetail[] = await apiInstance.getStudents();
        if (t_students.length != 0)
            setStudents(t_students);
    }
    
    if (students.length === 0) {
        asyncGetStudents();
    }
    
    const deleteCohort = () => {
        console.log("Delete Cohort");
    }

    var output = (<></>);
    // Temp subset/sorted students 
    var sub_students : UserDetail[] = [...students];

    var sub_cohorts = cohorts.map((cohort, index) => {
        var c_students : UserDetail[] = [];
        students.forEach((student) => {
            if (cohorts[0].id === index + 1) {
                c_students.push(student)
            }
        })
        return {
            students: c_students,
            name: cohort
        }
    })
    // Filter
    if (props.filter != "") {
        const regexp = new RegExp(".*" + props.filter + ".*", 'i');
        sub_students = sub_students.filter((student) => {
            if (regexp.test(student.first_name) ||
                regexp.test(student.last_name) ||
                regexp.test(student.first_name + " " + student.last_name) ||
                regexp.test(student.last_name + " " + student.first_name)) {
                    return true;
                } else {
                    return false;
                }
        });

        sub_cohorts = sub_cohorts.filter((cohort) => {
            if (regexp.test(cohort.name.name)) {
                    return true;
                } else {
                    return false;
                }
        });
    }
    // Sort
    if (props.sort === "lname") {
        sub_students = sub_students.sort((student1, student2) => {return student1.last_name.localeCompare(student2.last_name)});
    } else if (props.sort === "fname") {
        sub_students = sub_students.sort((student1, student2) => {return student1.first_name.localeCompare(student2.first_name)});
    } else if (props.sort === "cohort") {
        sub_students = sub_students.sort((student1, student2) => {
            if (student1.profile?.cohorts[0] === student2.profile?.cohorts[0]) {
                return 0;
            } else if (student1.profile != null && student2.profile != null && student1.profile?.cohorts[0] < student2.profile?.cohorts[0]) {
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

    if (props.view === "student") {
        output = (<>
            <Collapse>
            {sub_students.map((student) => (
                            <Panel  key={student.pk}
                            header={ (<><Avatar size="default" icon={<UserOutlined/>}/> <b> {student.first_name} {student.last_name} </b></>)}
                            >
                                <StudentPanel student={student}/>
                            </Panel>
            ))}
            </Collapse>

        </>);
    } else if (props.view === "cohort") {
        output = (<>
            <Collapse>
                {sub_cohorts.map((cohort) => 
                    <Panel key={cohort.name.name} header={cohort.name.name}>
                        <Message to={cohort.name.name} cohort={cohorts.indexOf(cohort.name) + 1}/>
                        <Danger action="Delete Cohort" callback={deleteCohort} icon={<CloseOutlined/>}/>
                        <Collapse>

                            {cohort.students.map((student) => (
                            <Panel  key={student.pk}
                            header={ (<><Avatar size="default" icon={<UserOutlined/>}/> <b> {student.first_name} {student.last_name} </b></>)}
                            >
                                <StudentPanel student={student}/>)
                            </Panel>
                            ))}
                        </Collapse>
                    </Panel>
                )}
            </Collapse>
        </>);
    }
    return output;
}

const StudentPanel = (props: any) => {
    const student = props.student;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isGradesModalVisible, setGradesModalVisible] = useState(false);

    const cohorts = useAppSelector(state => state.user.userDetail?.profile?.cohorts || []);
    const cohortId = useAppSelector(state => state.user.currentCohort);
    const cohortName = cohortId ? cohorts.find(obj => { return obj.id === cohortId })?.name : 'none';
    console.log(cohortName)
    
    const showCohortModal = () => {
      setIsModalVisible(true);
    };
    const handleCancel = () => {
      setIsModalVisible(false);
    };
    const deleteUser = () => {
        apiInstance.deleteUser(student.pk);
    }

    const showGradesModal = () => {
        setGradesModalVisible(true);
    }

    const hideGradesModal = () => {
        setGradesModalVisible(false);
    }

    const changeCohort = () => {
        var temp_students = [...students];
        if (student.profile) {
            student.profile.cohorts = selected_cohorts;
        }

        const student_idx = students.findIndex((curr) => curr.pk === student.pk);
        temp_students[student_idx] = student;
        setStudents(temp_students);

        apiInstance.editUser(student.pk, student);
        setIsModalVisible(false);
    }


    var selected_cohorts: any[];
    const options = cohorts.map((cohort, idx) => ( {"label": cohort, "value": (idx + 1)} ))
    const id = student.pk;
    return (<>

                <Descriptions  title="User Info" column={1} bordered>
                    <Descriptions.Item label="Email">{student.email}</Descriptions.Item>
                    <Descriptions.Item label="Cohort">{cohortName}</Descriptions.Item>
                    {/* <Descriptions.Item label="Guardian E-mail">mom@moms.com</Descriptions.Item> */}
                </Descriptions>
                {/* <Message  to={student.first_name + " " + student.last_name}/> */}
                <Button icon={<TeamOutlined/>} onClick={showCohortModal}>
                    Change Cohort
                </Button>
                <Modal title="Change Cohort" visible={isModalVisible} onOk={changeCohort} onCancel={handleCancel}>
                    <Checkbox.Group options={options} defaultValue={student.profile === null ? [] : student.profile.cohorts} onChange={ (selected) => selected_cohorts = selected}/>
                </Modal>
                <Link to={`/students/${id}`}>
                    <Button icon={<FormOutlined/>}>
                        Show Grades
                    </Button>
                </Link>

                <Danger  action="Delete User" callback={deleteUser} icon={<CloseOutlined/>}/>
    </>);
}






export default Students;