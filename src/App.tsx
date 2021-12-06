import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Redirect, Switch} from "react-router-dom";
import {useAppSelector, useAppDispatch} from "./redux/store";
import NavBar from './scenes/NavBar';
import Home from "./scenes/Home";
import Login from './scenes/Login';
import Announcements from './scenes/Announcements';
import Calendar from './scenes/Calendar';
import CreateAssignment from './scenes/CreateAssignment';
import Assignments from './scenes/Assignments';
import Assignment from 'scenes/AssignmentDescription';
import Progress from './scenes/Progress';
import Account from './scenes/Account';
<<<<<<< HEAD
import Students from 'scenes/Students';
=======
import Students from './scenes/Students';
>>>>>>> e8bf35dfd59eaa16c3407d2d213893d2a0c89d87
import './App.css';
import {getAssignments} from "./redux/assignmentSlice";
import {getMeetings} from "./redux/meetingsSlice";
import { refresh } from 'redux/userSlice';
import apiInstance from 'utils/api';

import {getAnnouncements} from "./redux/announcementsSlice";
import Grades from "./scenes/Grades";

function App(props: any) {
    const [loading, setLoading] = useState(true);
    const authenticated = useAppSelector((state) => state.user.authenticated);
    const currentUser = useAppSelector((state) => state.user.userDetail);
    const currentCohort = useAppSelector((state) => state.user.currentCohort);
    const role = useAppSelector((state) => state.user.userDetail?.profile?.role);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (loading) {
            dispatch(refresh());
            setLoading(false);
        }
        if (authenticated && currentCohort) {
            dispatch(getMeetings(currentCohort));
            dispatch(getAnnouncements(currentCohort));
        }
        if (authenticated) {
            dispatch(getAssignments());
        }
    }, [authenticated, currentCohort])


    return (
        <BrowserRouter>
            <Switch>
                <Route exact path ="/">
                    {authenticated ? <Redirect to="/home" /> : <Redirect to="/login" />}
                </Route>

                <Route path="/login">
                    {authenticated ? <Redirect to="/home" /> : <Login /> }
                </Route>

                {!authenticated ? <Redirect to="/login" /> : <Switch>
                    <Route path="/home">
                        <NavBar content={<Home />} user={currentUser}/>
                    </Route>
                    <Route path="/announcements">
                        <NavBar content={<Announcements />} user={currentUser}/>
                    </Route>
                    <Route path="/calendar">
                        <NavBar content={<Calendar />} user={currentUser}/>
                    </Route>
                    <Route exact path="/assignments">
                        <NavBar content={<Assignments />} user={currentUser}/>
                    </Route>
                    <Route path="/assignments/create">
                        <NavBar content={<CreateAssignment />} user={currentUser}/>
                    </Route>
                    <Route path="/assignments/:id">
                        <NavBar content={<Assignment user={currentUser} /> } user={currentUser}/>
                    </Route>
                    <Route path="/grades">
                        <NavBar content={<Grades student={currentUser}/>} user={currentUser} />
                    </Route>
                    <Route path="/account">
                        <NavBar content={<Account />} user={currentUser}/>
                    </Route>

                    {/* Routes reserved for instructors. */}
                    {role !== "INSTRUCTOR" ? <Redirect to="/home" /> : <Switch>
                        <Route path="/students">
                            <NavBar content={<Students />} />
                        </Route>
                    </Switch>}
                </Switch>}
            </Switch>
        </BrowserRouter>
    )
}


export default App;
