import React, {useState} from 'react';
import {Calendar as CalendarComponent, Card, Modal} from 'antd';
import moment, { Moment } from 'moment';
import {useAppSelector} from "../redux/store";
import {Meeting, meetingsSelectors} from "../redux/meetingsSlice";
import {Assignment, assignmentsSelectors} from "../redux/assignmentSlice";
import {withRouter, Link} from "react-router-dom";

const Calendar = (props: any) => {
    const meetings = useAppSelector(meetingsSelectors.selectAll);
    const assignments = useAppSelector(assignmentsSelectors.selectAll);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    const dateCellRender = (dateCellMoment: Moment) => {
        const meetingsOnDate: Meeting[] = meetings.filter(meeting => {
            return dateCellMoment.format('YYYY-MM-DD') === meeting.date
        });

        const assignmentsOnDate: Assignment[] = assignments.filter(assignment => {
            return dateCellMoment.format('YYYY-MM-DD') === moment(assignment.due_date).format('YYYY-MM-DD')
        });

        if (!meetingsOnDate && !assignmentsOnDate) {
            return null;
        }

        return (
            <ul>
                {meetingsOnDate.map(meeting => <li>{meeting.name}</li>)}
                {assignmentsOnDate.map(assignment => <li>{assignment.name}</li>)}
            </ul>
        )
    };

    const onSelect = (selectedDate: Moment) => {
        setIsModalVisible(true);
        setSelectedDate(selectedDate.format('YYYY-MM-DD'))
    }

    return (
        <>
            <Modal title={moment(selectedDate).format('dddd[,] MMMM Do')} visible={isModalVisible} onOk={()=>setIsModalVisible(false)} onCancel={() => setIsModalVisible(false)}>
                    <h3>Assignments</h3>
                    {assignments.map(assignment => {
                        if (selectedDate === moment(assignment.due_date).format('YYYY-MM-DD')) {
                            return (<Link to={`/assignments/${assignment.id}`}>
                                <Card hoverable>
                                    <b>{assignment.name}</b><br/>Due at {moment(assignment.due_date).format('hh:mma')}
                                </Card>
                            </Link>)
                        }
                    })}
                    <h3>Meetings</h3>
                    {meetings.map(meeting => {
                        if (selectedDate === moment(meeting.date).format('YYYY-MM-DD')) {
                            return (<Link to={`/meetings/${meeting.id}`}>
                                <Card hoverable>
                                    <b>{meeting.name}</b><br/>At {moment(meeting.date).format('hh:mma')}
                                </Card>
                            </Link>)
                        }
                    })}
            </Modal>
            <CalendarComponent dateCellRender={dateCellRender} onSelect={onSelect}/>
        </>
    )
}

export default withRouter(Calendar);