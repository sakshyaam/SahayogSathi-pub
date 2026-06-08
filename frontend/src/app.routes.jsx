import React from 'react'
import Login from './features/auth/pages/Login.jsx'
import { createBrowserRouter } from 'react-router-dom'
import Register from './features/auth/pages/Register.jsx'
import LandingPage from './features/auth/pages/LandingPage.jsx'
import Dashboard from './features/auth/pages/Dashboard.jsx'
import ProtectedRoute from './features/auth/components/ProtectedRoute.jsx'
import CreatePost from './features/auth/pages/CreatePost.jsx'
import MyPosts from './features/auth/pages/MyPosts.jsx'
import PostDetails from './features/auth/pages/PostDetails.jsx'


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
        element : <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    },
    {
        path : "/createpost",
        element : <ProtectedRoute>
            <CreatePost />
        </ProtectedRoute>
    },
    {
        path : "/myposts",
        element : <ProtectedRoute>
            <MyPosts />
        </ProtectedRoute>
    },
    {
        path : "/post/:postId",
        element : <ProtectedRoute>
            <PostDetails />
        </ProtectedRoute>
    }
])
