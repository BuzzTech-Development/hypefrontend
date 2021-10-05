import React, {useEffect} from 'react';
import {
    BrowserRouter,
    Redirect,
    Route,
    Switch
} from "react-router-dom";

import {useAppDispatch, useAppSelector} from "./redux/store";
import {getMeetings} from "./redux/meetingsSlice";
import Home from "./scenes/Home";
import Login from "./scenes/Login";

import './App.css';

function App() {
    const authenticated = useAppSelector((state) => state.user.authenticated);
    const currentCohort = useAppSelector((state) => state.user.currentCohort);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (authenticated && currentCohort) {
            dispatch(getMeetings(currentCohort));
        }
    }, [authenticated, currentCohort])

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login">
                    {authenticated ? <Redirect to="/" /> : <Login />}
                </Route>
                <Route path="/">
                    {authenticated ? <Home /> : <Redirect to="/login" />}
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default App;
