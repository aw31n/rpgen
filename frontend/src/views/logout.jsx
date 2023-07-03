import { useEffect } from 'react';
import Home, { LoggedOutView } from './home';
import { logout } from '../utils/auth';
import React from "react";
import { useSnackbar } from 'notistack';
import { useAuthStore } from '../store/auth';

const Logout = () => {
    const { enqueueSnackbar } = useSnackbar();
    const state = useAuthStore((state) => state)

    useEffect(() => {
        if (state.isLoggedIn()) {
            logout();
            // enqueueSnackbar("You have been logged out", { variant: "info"})
            window.location.reload(true)
        }

    }, []);
    return <Home />;
};

export default Logout;