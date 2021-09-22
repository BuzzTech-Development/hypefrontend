import React, { useContext } from 'react';
import AuthContext from './context/AuthContext';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import NavBar from './scenes/NavBar';
import Home from "./scenes/Home";
import Login from "./scenes/Login";
import Announcements from 'scenes/Announcements';
import Calendar from 'scenes/Calendar';
import Assignments from 'scenes/Assignments';
import Progress from 'scenes/Progress';
import Account from 'scenes/Account';

import './App.css';
import { Layout } from 'antd';

function App() {
    const user = useContext(AuthContext);

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login">
                    <NavBar content={<Login />} />
                </Route>
                <Route path="/announcements">
                    <NavBar content={<Announcements />} />
                </Route>
                <Route path="/calendar">
                    <NavBar content={<Calendar />} />
                </Route>
                <Route path="/assignments">
                    <NavBar content={<Assignments />} />
                </Route>
                <Route path="/progress">
                    <NavBar content={<Progress />} />
                </Route>
                <Route path="/account">
                    <NavBar content={<Account />} />
                </Route>
                <Route path="/">
                    <NavBar content={<Home />} />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default App;
