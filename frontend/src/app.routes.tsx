import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import LandingPage from './features/auth/pages/LandingPage';
import Dashboard from './features/auth/pages/Dashboard';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import CreatePost from './features/auth/pages/CreatePost';
import MyPosts from './features/auth/pages/MyPosts';
import PostDetails from './features/auth/pages/PostDetails';
import Chat from './features/auth/pages/Chat';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/createpost",
    element: (
      <ProtectedRoute>
        <CreatePost />
      </ProtectedRoute>
    )
  },
  {
    path: "/myposts",
    element: (
      <ProtectedRoute>
        <MyPosts />
      </ProtectedRoute>
    )
  },
  {
    path: "/post/:postId",
    element: (
      <ProtectedRoute>
        <PostDetails />
      </ProtectedRoute>
    )
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    )
  }
]);
