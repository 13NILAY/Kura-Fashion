import React from 'react'
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useRefreshToken from "../../hooks/useRefreshToken";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                setError(err);
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        // Only verify if there's no access token and persist is enabled
        if (!auth?.accessToken && persist) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }

        return () => {
            isMounted = false;
        }
    }, [auth?.accessToken, persist, refresh]);

    // Handle loading and error states
    if (!persist) {
        return <Outlet />;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    if (error) {
        return <Outlet />; // Fallback to login if refresh fails
    }

    return <Outlet />;
}

export default PersistLogin;