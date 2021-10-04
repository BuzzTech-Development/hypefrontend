import { Button } from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";

const Assignments = (props: any) => {
    const createAssignment = () => {
        props.history.push('/assignments/create')
    }

    /* IF USER IS A TEACHER
    return (
        <Button onClick={createAssignment}>Create an assignment</Button>
    )
    */

    return (
        <></>
    )
}

export default withRouter(Assignments);