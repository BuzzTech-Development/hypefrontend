import { Button, List, Space } from 'antd';
import React, { useState } from 'react';
import { withRouter, Link } from "react-router-dom";
import { UserDetail, UserRole } from 'redux/userSlice';
import {Assignment, assignmentsSelectors} from "../redux/assignmentSlice";
import store, {useAppSelector} from "../redux/store";

const Assignments = (props: any) => {
    const assignments: Assignment[] = useAppSelector(assignmentsSelectors.selectAll);
    const role = useAppSelector((state) => state.user.userDetail?.profile?.role);

    const createAssignment = () => {
        props.history.push('/assignments/create')
    }

    return (<Space direction='vertical' size='large' style={{width: '80%'}}>
        {role !== "INSTRUCTOR" ? <></> : <Button onClick={createAssignment}>Create an assignment</Button>}
        {assignments.length === 0 ? <></> : <AssignmentList assignments={assignments}/>}
    </Space>)
}

const AssignmentList = (props: any) => {
    const assignments = props.assignments;

    // get current, overdue, and undated assignments
    assignments.sort(function(a: Assignment, b: Assignment) {
        if (a.due_date === b.due_date) return 0;
        if (a.due_date === "") return -1;
        if (b.due_date === "") return 1;
        return new Date(a.due_date) > new Date(b.due_date) ? 1 : -1
    });
    const dateTime = new Date();
    const current = assignments.filter((v: Assignment) => {
        return v.due_date !== "" && (new Date(v.due_date) > dateTime)
    });
    const overdue = assignments.filter((v: Assignment) => v.due_date !== "" && (new Date(v.due_date) <= dateTime));
    const undated = assignments.filter((v: Assignment) => v.due_date === "");

    return (<>
        {current.length === 0 ? <></> : <AssignmentSubList assignments={current} header={'Current Assignments'} />}
        {overdue.length === 0 ? <></> : <AssignmentSubList assignments={overdue} header={'Overdue Assignments'} />}
        {undated.length === 0 ? <></> : <AssignmentSubList assignments={undated} header={'Undated Assignments'} />}
    </>)
}

const AssignmentSubList = (props: any) => {
    const assignments = props.assignments;
    const header = props.header;

    // probably need to localize these times
    const dueDates = assignments.map((assignment: Assignment) => assignment.due_date !== '' ? new Date(assignment.due_date).toLocaleDateString("en-US", { day: 'numeric', month: 'long' }) : null)
    const dueTimes = assignments.map((assignment: Assignment) => assignment.due_date !== '' ? new Date(assignment.due_date).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit'}) : null)
    const [hover, setHover] = useState(-1);
    const nonhoverStyle = {
        borderTop: '1px solid black',
    }
    const hoverStyle = {
        borderTop: '1px solid black',
        backgroundColor: '#DBF3FA',
    }
    const hoverBottomStyle = {
        borderTop: '1px solid black',
        backgroundColor: '#DBF3FA',
        borderRadius: '0 0 1em 1em'
    }

    return (<List size='large' bordered style={{borderRadius: '1em', marginBottom: '2.5em'}}>
        <div className='ant-list-header' style={{backgroundColor: '#a9a9a9', borderRadius: '1em 1em 0 0', borderBottom: '1px solid black'}}>
            <b>{header}</b>
        </div>
        {assignments.map((assignment: Assignment, i: any) =>(
            <List.Item key={i}
                style={hover === i ? (i === assignments.length - 1 ? hoverBottomStyle : hoverStyle) : nonhoverStyle}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(-1)}
            >
                {/* switch the index to id once we set that up */}
                <Link to={{pathname: `assignments/${assignment.id}`}} style={{color: 'black'}}>
                    <div style={{textAlign: 'left'}}>
                        <b>{assignment.name}</b>
                    </div>
                    {assignment.due_date === "" ? <></> : <div style={{textAlign: 'right'}}>
                        <b>Due</b> {dueDates[i]} at {dueTimes[i]} 
                    </div>}
                </Link>
            </List.Item>
        ))}
    </List>)
}

export default withRouter(Assignments);