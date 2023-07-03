import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './views/home';
import MainWrapper from './layouts/MainWrapper';
import Login from './views/login';
import PrivateRoute from './layouts/PrivateRoute';
import Logout from './views/logout';
import Private from './views/private';
import Register from './views/register';
import React from "react";
import "./styles/app.css";
import { SnackbarProvider } from 'notistack';
import App from './views/app';

function Main() {

    return (
        <SnackbarProvider maxSnack={3}>
            <BrowserRouter>
                <MainWrapper>
                    <Routes>
                        <Route
                            path="/app"
                            element={
                                <PrivateRoute>
                                    <App />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </MainWrapper>
            </BrowserRouter>
        </SnackbarProvider>
    );
}

export default Main;