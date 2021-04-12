import React from 'react';
import './App.css';
import Login from "./scenes/Login";
import {useAppSelector} from "./redux/store";
import Home from "./scenes/Home";
import {
    BrowserRouter,
    Redirect,
    Route,
    Switch
} from "react-router-dom";

function App() {
    const authenticated = useAppSelector((state) => state.user.authenticated);

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
