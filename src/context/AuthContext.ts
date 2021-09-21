import React from "react";

const AuthContext = React.createContext({
    token: null,
    userId: null,
    statusChanged: () => {},
    clearAuth: () => {}
});

export default AuthContext; 