import React from 'react'
import Login from './features/pages/Login.jsx'
import Register from './features/pages/Register.jsx'
import { createBrowserRouter } from 'react-router-dom'



export const router = createBrowserRouter([

    {
        path : "/login",
        element : <Login />
    },
    {
        path : "/register",
        element : < Register />
    }
])
