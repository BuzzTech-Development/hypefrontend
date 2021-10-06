import React from 'react';
import {
    BrowserRouter,
    Redirect,
    Route,
    Switch
} from "react-router-dom";

import Home from "./scenes/Home";
import Login from "./scenes/Login";
import CreateAssignment from "./scenes/CreateAssignment";
import {useAppSelector} from "./redux/store";

import './App.css';

function App() {
    const authenticated = useAppSelector((state) => state.user.authenticated);

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/assignment/create">
                    <CreateAssignment/>
                </Route>
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
