import React from 'react';
import {Button} from "antd";
import './App.css';
import {useSelector} from "react-redux";
import Login from "./scenes/Login";
import {useAppSelector} from "./redux/store";
import Home from "./scenes/Home";

function App() {
    const authenticated = useAppSelector((state) => state.user.authenticated);

    return authenticated ? <Home /> : <Login />
}

export default App;
