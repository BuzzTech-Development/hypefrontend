import { Button, List, Space } from 'antd';
import React, { useState } from 'react';
import { withRouter, Link } from "react-router-dom";
import moment from 'moment';
import {Assignment, assignmentsSelectors} from "../redux/assignmentSlice";
import store from "../redux/store";

const Assignments = (props: any) => {
    const assignments: Assignment[] = assignmentsSelectors.selectAll(store.getState());

    const createLists = (assignments: Assignment[]) => {
        // get current, overdue, and undated assignments
        assignments.sort(function(a: any, b: any) {
            if (a.dueDate === b.dueDate) return 0;
            if (a.dueDate === null) return -1;
            if (b.dueDate === null) return 1;
            return a.dueDate > b.dueDate ? 1 : -1
        });
        const dateTime = moment();
        const current = assignments.filter((v: any) => v.dueDate > dateTime);
        const overdue = assignments.filter((v: any) => v.dueDate && v.dueDate <= dateTime);
        const undated = assignments.filter((v: any) => !v.dueDate);
        return [current, overdue, undated];
    }
    const assignmentLists = createLists(assignments);

    const createAssignment = () => {
        props.history.push('/assignments/create')
    }

    return (<Space direction='vertical' size='large' style={{width: '80%'}}>
        <Button onClick={createAssignment}>Create an assignment</Button>
        {assignmentLists[0].length === 0 ? <></> : <AssignmentList assignments={assignmentLists[0]} header={'Current Assignments'} />}
        {assignmentLists[1].length === 0 ? <></> : <AssignmentList assignments={assignmentLists[1]} header={'Overdue Assignments'} />}
        {assignmentLists[2].length === 0 ? <></> : <AssignmentList assignments={assignmentLists[2]} header={'Undated Assignments'} />}
    </Space>)
}

function AssignmentList(props: any) {
    const assignments = props.assignments;
    const header = props.header;
    // probably need to localize these times
    const dueDates = assignments.map((assignment: any) => assignment.dueDate !== '' ? moment(assignment.dueDate).format('MMMM DD') : null)
    const dueTimes = assignments.map((assignment: any) => assignment.dueDate !== '' ? moment(assignment.dueDate).format('LT') : null)
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

    return (<List size='large' bordered style={{borderRadius: '1em'}}>
        <div className='ant-list-header' style={{backgroundColor: '#a9a9a9', borderRadius: '1em 1em 0 0', borderBottom: '1px solid black'}}>
            <b>{header}</b>
        </div>
        {assignments.map((assignment: any, i: any) =>(
            <List.Item key={i}
                style={hover === i ? (i === assignments.length ? hoverBottomStyle : hoverStyle) : nonhoverStyle}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(-1)}
            >
                {/* switch the index to id once we set that up */}
                <Link to={{pathname: `assignments/${assignment.id}`}} style={{color: 'black'}}>
                    <div style={{textAlign: 'left'}}>
                        <b>{assignment.name}</b>
                    </div>
                    {assignment.dueDate === null ? <></> : <div style={{textAlign: 'right'}}>
                        <b>Due</b> {dueDates[i]} at {dueTimes[i]} 
                    </div>}
                </Link>
            </List.Item>
        ))}
    </List>)
}

export default withRouter(Assignments);