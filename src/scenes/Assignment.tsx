import { PageHeader, Divider } from 'antd';
import React from 'react';
import { withRouter, useParams, Link } from "react-router-dom";
import moment from 'moment';

const Assignment = (props: any) => {
    const {id} = useParams<{id? : any}>();
    // hard-coded assignment
    // should be fetched using id
    const assignment = {
        name: 'Exam 1',
        id: 913252,
        description: '<p>This exam is intended to monitor your comprehension over the first few weeks of this course. This exam will cover content through Chapter 7 of the textbook.</p><p>This exam is strictly <b>CLOSED-NOTES</b>. Making <i>any</i> attempt to collaborate with others will be viewed as an academic infraction and treated accordingly.</p><br><p><b>Good luck!</b></p>',
        points: 100,
        badge: null,
        dueDate: moment().add(1, 'weeks').add(3, 'hours'),
        files: [{
            label: 'completed_exam_1',
            extension: 'pdf',
            type: 'PDF'
        }]
    }

    return (<>
        <Divider orientation='left'>
            <PageHeader title={assignment.name} />
        </Divider>
    </>)
}

export default withRouter(Assignment);