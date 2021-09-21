import React, { useContext } from 'react';
import AuthContext from 'context/AuthContext';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Home from "./scenes/Home";
import Login from "./scenes/Login";

import './App.css';

function App() {
    const user = useContext(AuthContext);

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
