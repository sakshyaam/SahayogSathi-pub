import { RouterProvider } from "react-router-dom"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { SocketProvider } from "./context/socket.context.jsx"

function App() {


  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router = {router} />
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
