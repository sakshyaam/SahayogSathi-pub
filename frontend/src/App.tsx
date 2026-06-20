import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import { AuthProvider } from "./features/auth/auth.context";
import { SocketProvider } from "./context/socket.context";
import { NotificationListener } from "./features/auth/components/NotificationListener";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
        <NotificationListener />
      </SocketProvider>
    </AuthProvider>
  );
}


export default App;
