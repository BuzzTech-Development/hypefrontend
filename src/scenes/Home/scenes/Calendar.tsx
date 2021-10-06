import React from 'react';
import {Calendar as CalendarComponent} from 'antd';
import { Moment } from 'moment';
import {useAppSelector} from "../../../redux/store";
import {Meeting, meetingsSelectors} from "../../../redux/meetingsSlice";

const Calendar = () => {
    const meetings = useAppSelector(meetingsSelectors.selectAll);

    const dateCellRender = (dateCellMoment: Moment) => {
        const meetingsOnDate: Meeting[] = meetings.filter(meeting => {
            return dateCellMoment.format('YYYY-MM-DD') === meeting.date
        });

        if (!meetingsOnDate) {
            return null;
        }

        return (
            <ul>
                {meetingsOnDate.map(meeting => <li>{meeting.name}</li>)}
            </ul>
        )
    };

    return <CalendarComponent dateCellRender={dateCellRender} />;
}

export default Calendar;