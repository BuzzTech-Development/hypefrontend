import React, {useEffect, useState} from "react";
import {List, Row, Col} from 'antd';
import {useSelector} from "react-redux";
import {useAppSelector} from "../redux/store";
import { withRouter, Link, useLocation } from "react-router-dom";
import {Assignment, assignmentsSelectors, gradeSubmission, Submission} from "../redux/assignmentSlice";
import {Announcement, announcementsSelectors} from "../redux/announcementsSlice";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import VisibilitySensor from 'react-visibility-sensor';

const DOMPurify = require('dompurify')(window);

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

const gradeToLetter = (grade: number) => {
    if (grade >= 94) return 'A';
    if (grade >= 90) return 'A-';
    if (grade >= 87) return 'B+';
    if (grade >= 84) return 'B';
    if (grade >= 80) return 'B-';
    if (grade >= 77) return 'C+';
    if (grade >= 74) return 'C';
    if (grade >= 70) return 'C-';
    if (grade >= 60) return 'D';
    return 'F';
}

const formatDate = (date: string) => {
    const day = date !== '' ? new Date(date).toLocaleDateString("en-US", { day: 'numeric', month: 'long' }): '';
    const time = date !== '' ? new Date(date).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit'}) : '';
    return day + " at " + time;
}

const SingleGrade = (props: any) => {
    const location = useLocation();
    const submission = props.submission;
    const [grade, setGrade] = useState(0);
    const letterGrade = gradeToLetter(grade);

    const visibleChange = (isVisible: boolean) => {
        if (isVisible) setGrade(parseFloat((((submission.points * 1.0) / submission.pointsPossible) * 100).toFixed(2)));
        else setGrade(0);
    }

    return <>
        <h1><b>{submission.name}: {grade}% ({letterGrade})</b></h1>
        <VisibilitySensor onChange={visibleChange}>
            <div style={{width: '50%', margin: '0 auto'}}>
                <CircularProgressbar value={grade}
                    styles={buildStyles({
                        // Rotation of path and trail, in number of turns (0-1)
                        rotation: 0.25,
                    
                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                        strokeLinecap: 'butt',
                    
                        // Text size
                        textSize: '16px',
                    
                        // How long animation takes to go from one percentage to another, in seconds
                        pathTransitionDuration: 0.75,
                    
                        // Can specify path transition in more detail, or remove it entirely
                        // pathTransition: 'none',
                    
                        // Colors
                        pathColor: `#124552`,
                        textColor: '#f88',
                        trailColor: '#d6d6d6',
                        backgroundColor: '#3e98c7',
                    })}
                />
            </div>
        </VisibilitySensor>
    </>;
}

const GradeSummary = (props: any) => {
    const assignments = props.assignments;
    const userId = useAppSelector((state) => state.user.userDetail?.pk);
    const submitted = assignments.filter((v: Assignment) => {
        const submissions = v.submissions.filter((submission: Submission) =>
            submission.author === userId
        );
        return submissions.length !== 0;
    });

    const getMostRecentSubmission = (assignment: Assignment) => {
        const submissions = assignment.submissions.filter((submission: Submission) => submission.author === userId);
        if (submissions.length === 0) return null;
        return submissions[submissions.length-1];
    }

    // most recent submission for all graded assignments
    const submissions = submitted.map((assignment: Assignment, i:any) => {
        const submission = getMostRecentSubmission(assignment);
        if (!submission || !submission?.graded) return null;
        const dataValue = {
            key: i,
            id: assignment.id,
            name: assignment.name,
            submittedDate: formatDate(submission.time),
            points: submission.points,
            pointsPossible: assignment.points
        }
        return dataValue;
    }).filter((submission: any) => { return submission !== null });

    // calculate overall grade
    let totalPoints = 0;
    let points = 0;
    for (let i = 0; i < submissions.length; i++) {
        totalPoints += submissions[i].pointsPossible;
        points += submissions[i].points;
    }
    const grade = parseFloat((((points * 1.0) / totalPoints) * 100).toFixed(2));
    const letterGrade = gradeToLetter(grade);

    // most recent submissions
    const numGrades = 3;
    submissions.sort((a: any, b : any) => (a.submittedDate > b.submittedDate) ? -1 : 1);
    const recents = submissions.slice(0, numGrades);

    return <div style={{border: '1px solid grey', borderRadius: '1em', width: '100%', textAlign: 'left', padding: '1em'}}>
        <h2><b>Current overall grade: {grade}% ({letterGrade})</b></h2>
        <h2>Recent Grades:</h2>
        <Row>
            {recents.map((recent: any) => {
                return <Col key={recent.key} span={24 / recents.length}>
                    <SingleGrade submission={recent} />
                </Col>
            })}
        </Row>
    </div>
}

const RecentAnnouncements = (props: any) => {
    let announcements = props.announcements;
    const [hover, setHover] = useState(-1);
    const numAnnouncements = 3;

    // only most recent announcements
    announcements.sort((a: Announcement, b : Announcement) => (a.created_at > b.created_at) ? -1 : 1);
    const recents = announcements.slice(0, numAnnouncements);

    return (<List size='large' bordered style={{borderRadius: '1em', width: '100%'}}>
        <div className='ant-list-header' style={{backgroundColor: '#124552', borderRadius: '1em 1em 0 0', borderBottom: '1px solid black'}}>
            <b>Recent Announcements</b>
        </div>
        {recents.map((announcement: Announcement, i: any) =>(
            <List.Item key={i}
                style={hover === i ? (i === recents.length ? hoverBottomStyle : hoverStyle) : nonhoverStyle}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(-1)}
            >
                <Link to={{pathname: `annoucements/${announcement.id}`}} style={{color: 'black', textAlign: 'left'}}>
                    <div>
                        <b>{announcement.subject}</b> {announcement.created_at.slice(0, 10)}
                    </div>
                    <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(announcement.text)}}
                    style={{maxHeight: '1.15em', lineHeight: '1em', overflow: 'hidden', textOverflow: 'ellipsis'}}></div>
                </Link>
            </List.Item>
        ))}
    </List>)
}

const UpcomingAssignments = (props: any) => {
    let assignments = props.assignments;
    const [hover, setHover] = useState(-1);
    const numAssignments = 3;

    // only most recent assignments
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
    const recents = current.slice(0, numAssignments);

    return (<List size='large' bordered style={{borderRadius: '1em', width: '100%'}}>
        <div className='ant-list-header' style={{backgroundColor: '#124552', borderRadius: '1em 1em 0 0', borderBottom: '1px solid black'}}>
            <b>Upcoming Assignments</b>
        </div>
        {recents.map((assignment: Assignment, i: any) =>(
            <List.Item key={i}
                style={hover === i ? (i === recents.length ? hoverBottomStyle : hoverStyle) : nonhoverStyle}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(-1)}
            >
                <Link to={{pathname: `assignments/${assignment.id}`}} style={{color: 'black'}}>
                    <div style={{textAlign: 'left'}}>
                        <b>{assignment.name}</b>
                    </div>
                    <div style={{maxHeight: '1.15em', lineHeight: '1em', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                        <b>Due</b> {formatDate(assignment.due_date)}
                    </div>
                </Link>
            </List.Item>
        ))}
    </List>)
}

const Home = () => {
    const assignments: Assignment[] = useAppSelector(assignmentsSelectors.selectAll);
    const announcements = useSelector(announcementsSelectors.selectAll);

    const rowStyle = {
        width: '80%',
        display: 'inline-flex',
        marginBottom: '2.5em'
    }

    return (<div style={{width: '100%', textAlign: 'center'}}>
        <Row style={rowStyle}>
            <Col span={24}>
                <GradeSummary assignments={assignments}/>
            </Col>
        </Row>
        <Row style={rowStyle} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={12}>
                <RecentAnnouncements announcements={announcements} />
            </Col>
            <Col span={12}>
                <UpcomingAssignments assignments={assignments} />
            </Col>
        </Row>
    </div>)
}

export default withRouter(Home);