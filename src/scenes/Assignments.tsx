import { Button, List, Row, Col, Divider, Space } from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";
import moment from 'moment';

const Assignments = (props: any) => {
    // hard-coded assignment list
    const assignments = [
        {
            name: 'Exam 1',
            description: '<p>This exam is intended to monitor your comprehension over the first few weeks of this course. This exam will cover content through Chapter 7 of the textbook.</p><p>This exam is strictly <b>CLOSED-NOTES</b>. Making <i>any</i> attempt to collaborate with others will be viewed as an academic infraction and treated accordingly.</p><br><p><b>Good luck!</b></p>',
            points: 100,
            badge: null,
            dueDate: moment().add(1, 'weeks'),
            files: [{
                label: 'completed_exam_1',
                extension: 'pdf',
                type: 'PDF'
            }]
        },
        {
            name: 'Homework 1',
            description: '<p>For this assignment, you are only expected to show proof of concept for working with React. Create a very simple webpage using React components and serve it using Node.</p><p>You must also submit a text file explaining your process for designing your webpage, as well as any difficults you encountered.</p>',
            points: 25,
            badge: null,
            dueDate: moment().subtract(6, 'days'),
            files: [{
                label: 'web_app',
                extension: 'zip',
                type: 'zip'
            },
            {
                label: 'report',
                extension: 'text',
                type: 'Text'
            }]
        },
        {
            name: 'Homework 2',
            description: '<p>For this homework, we want to assess the growth of your Python skills. You are given are excerpt from <i>Gulliver\'s Travels</i> by Jonathan Swift.</p><p>Design an efficient algorithm for counting the number of times that each word appears in the excerpt. Submit your solution as a zip file.</p>',
            points: 40,
            badge: null,
            dueDate: moment().add(2, 'days'),
            files: [{
                label: 'main.py',
                extension: 'zip',
                type: 'zip'
            }]
        },
        {
            name: 'Hot Air Balloon',
            description: '<p>By now, your group has completed a few sprints and should have a good understanding of what has and has not been working for your team. As a group, decide what what <b>wind</b> has been pushing your team forward and what <b>sandbags</b> you have faced. Also, note what rainy days and sunny days you expect to face during the next sprint.</p>',
            points: 30,
            badge: null,
            dueDate: null,
            files: [{
                label: 'hot_air_balloon',
                extension: 'image',
                type: 'Image'
            }]
        },
        {
            name: 'Course Feedback',
            description: '<p>While it\'s true that the teachers of this course are constantly evaluating your work, it\' also important for the students to evaluate the teachers on occasion. Submit a Word document explaining how you have felt about the course so far and what actions you think the teachers should take in the future to improve the course.</p><p>There is no required length for this assignment, although we expect most submissions to be about a page.</p>',
            points: 10,
            badge: null,
            dueDate: moment().add(5, 'days'),
            files: [{
                label: 'feedback',
                extension: 'docx',
                type: 'DOCX'
            }]
        }
    ]

    const createLists = (assignments: any) => {
        // get current, overdue, and undated assignments
        assignments.sort(function(a: any, b: any) {
            if (a.dueDate === b.dueDate) return 0;
            if (a.dueDate === null) return -1;
            if (b.dueDate === null) return 1;
            return a.dueDate > b.dueDate ? 1 : -1
        });
        const dateTime = moment();
        const current = assignments.filter((v: any) => v.dueDate > dateTime);
        const overdue = assignments.filter((v: any) => v.dueDate !== null && v.dueDate <= dateTime);
        const undated = assignments.filter((v: any) => v.dueDate === null);
        return [current, overdue, undated];
    }
    const assignmentLists = createLists(assignments);

    const createAssignment = () => {
        props.history.push('/assignments/create')
    }

    /* IF USER IS A TEACHER
    return (
        <Button onClick={createAssignment}>Create an assignment</Button>
    )
    */

    return (<Space direction='vertical' size='large' style={{width: '80%'}}>
        {assignmentLists[0].length === 0 ? <></> : <AssignmentList assignments={assignmentLists[0]} header={'Current Assignments'} />}
        {assignmentLists[1].length === 0 ? <></> : <AssignmentList assignments={assignmentLists[1]} header={'Overdue Assignments'} />}
        {assignmentLists[2].length === 0 ? <></> : <AssignmentList assignments={assignmentLists[2]} header={'Undated Assignments'} />}
    </Space>)
}

function AssignmentList(props: any) {
    const assignments = props.assignments;
    const header = props.header;
    const headerElem = <div>
        {header}
    </div>

    return (<List size="large" header={headerElem} bordered>
        {assignments.map((assignment: any, i: any) =>(
            <List.Item key={i}>
                {assignment.name}
            </List.Item>
        ))}
    </List>)
}

export default withRouter(Assignments);