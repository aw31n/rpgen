import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import React from "react";
import { Button } from '@mui/material';
import NavBar from '../components/navbar';
import Header from '../components/header/Header';
import { useSnackbar } from 'notistack';
import App from './app';

const Home = () => {
    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);
    return (
        <div className='w-full overflow-y-auto h-full'>
            <div className='flex flex-col items-center justify-center h-full'>
                <Header />
            </div>
            { /* isLoggedIn() ? <LoggedInView user={user()} /> : <LoggedOutView /> */}
        </div>
    );
};

export default Home;