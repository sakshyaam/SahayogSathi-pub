import React from 'react'
import Login from './features/auth/pages/Login.jsx'
import { createBrowserRouter } from 'react-router-dom'
import Register from './features/auth/pages/Register.jsx'
import LandingPage from './features/auth/pages/LandingPage.jsx'
import Dashboard from './features/auth/pages/Dashboard.jsx'



export const router = createBrowserRouter([
    {
        path : "/",
        element : <LandingPage />
    },

    {
        path : "/login",
        element : <Login />
    },
    {
        path : "/register",
        element : < Register />
    },
    {
        path : "/dashboard",
        element : <Dashboard />
    }
])
