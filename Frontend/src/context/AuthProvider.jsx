import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        // Try to get stored auth data on initial load
        const storedAuth = localStorage.getItem('authData');
        return storedAuth ? JSON.parse(storedAuth) : {
            isAuthenticated: false,
            roles: null,
            accessToken: null,
            email: null
        };
    });

    const setAuthInfo = ({ accessToken }, email, roles) => {
        const newAuth = {
            isAuthenticated: !!accessToken,
            accessToken,
            email,
            roles
        };
        setAuth(newAuth);
        // Store auth data in localStorage
        localStorage.setItem('authData', JSON.stringify(newAuth));
    };

    const [persist, setPersist] = useState(() => {
        const storedPersist = localStorage.getItem("persist");
        return storedPersist === null ? true : JSON.parse(storedPersist);
    });

    return (
        <AuthContext.Provider value={{ auth, setAuth, setAuthInfo, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
