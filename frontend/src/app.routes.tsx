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
import MockPayment from './features/auth/pages/MockPayment';
import NotificationPage from './features/auth/pages/NotificationPage';
import MyTasks from './features/auth/pages/MyTasks';
import DashboardLayout from './features/auth/components/DashboardLayout';
import Wallet from './features/auth/pages/Wallet';

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
    // Moved to DashboardLayout children
  {
    path: "/mock-payment",
    element: (
      <ProtectedRoute>
        <MockPayment />
      </ProtectedRoute>
    )
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/my-tasks",
        element: <MyTasks />
      },
      {
        path: "/myposts",
        element: <MyPosts />
      },
      {
        path: "/notifications",
        element: <NotificationPage />
      },
      {
        path: "/chat",
        element: <Chat />
      },
      {
        path: "/createpost",
        element: <CreatePost />
      },
      {
        path: "/post/:postId",
        element: <PostDetails />
      },
      {
        path: "/wallet",
        element: <Wallet />
      }
    ]
  }
]);
