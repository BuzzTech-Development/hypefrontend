import React, {useState} from "react";
import {List, Row, Col} from 'antd';
import {useSelector} from "react-redux";
import {useAppSelector} from "../redux/store";
import { withRouter, Link } from "react-router-dom";
import {Assignment, assignmentsSelectors} from "../redux/assignmentSlice";
import {Announcement, announcementsSelectors} from "../redux/announcementsSlice";

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

const RecentAnnouncements = () => {
    const announcements = useSelector(announcementsSelectors.selectAll);
    const [hover, setHover] = useState(-1);
    const numAnnouncements = 3;

    // only most recent announcements
    announcements.sort((a, b) => (a.created_at > b.created_at) ? -1 : 1);
    const recents = announcements.slice(0, numAnnouncements);

    return (<List size='large' bordered style={{borderRadius: '1em', width: '100%'}}>
        <div className='ant-list-header' style={{backgroundColor: '#a9a9a9', borderRadius: '1em 1em 0 0', borderBottom: '1px solid black'}}>
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
                        <b>{announcement.subject}</b> &nbsp; {announcement.created_at.slice(0, 10)}
                    </div>
                    <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(announcement.text)}}
                    style={{maxHeight: '1.3em', lineHeight: '1em', overflow: 'hidden', textOverflow: 'ellipsis'}}></div>
                </Link>
            </List.Item>
        ))}
    </List>)
}

const Home = () => {
    const assignments: Assignment[] = useAppSelector(assignmentsSelectors.selectAll);
    console.log(assignments);

    const rowStyle = {
        width: '80%',
        display: 'inline-flex',
        marginBottom: '2.5em'
    }

    return (<div style={{width: '100%', textAlign: 'center'}}>
        <Row style={rowStyle}>
            <Col span={24}>
                <RecentAnnouncements />
            </Col>
        </Row>
    </div>)
}

export default withRouter(Home);