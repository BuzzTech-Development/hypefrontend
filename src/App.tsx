import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from "react-router-dom";
import {useAppSelector} from "./redux/store";
import NavBar from './scenes/NavBar';
import Home from "./scenes/Home";
import Login from './scenes/Login';
import Announcements from './scenes/Announcements';
import Calendar from './scenes/Calendar';
import CreateAssignment from './scenes/CreateAssignment';
import Assignments from './scenes/Assignments';
import Assignment from 'scenes/Assignment';
import Progress from './scenes/Progress';
import Account from './scenes/Account';

import './App.css';

function App(props: any) {
    const authenticated = useAppSelector((state) => state.user.authenticated);

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path ="/">
                    {authenticated ? <Redirect to="/home" /> : <Redirect to="/login" />}
                </Route>

                <Route path="/login">
                    {authenticated ? <Redirect to="/home" /> : <Login /> }
                </Route>

                {!authenticated ? <Redirect to="/login" /> : <>
                    <Route path="/home">
                        <NavBar content={<Home />} />
                    </Route>
                    <Route path="/announcements">
                        <NavBar content={<Announcements />} />
                    </Route>
                    <Route path="/calendar">
                        <NavBar content={<Calendar />} />
                    </Route>
                    <Route exact path="/assignments">
                        <NavBar content={<Assignments />} />
                    </Route>
                    <Route exact path="/assignments/create">
                        <NavBar content={<CreateAssignment />} />
                    </Route>
                    <Route exact path="/assignments/:id">
                        <NavBar content={<Assignment />} />
                    </Route>
                    <Route path="/progress">
                        <NavBar content={<Progress />} />
                    </Route>
                    <Route path="/account">
                        <NavBar content={<Account />} />
                    </Route>
                </>}
            </Switch>
        </BrowserRouter>
    )
}

export default App;
