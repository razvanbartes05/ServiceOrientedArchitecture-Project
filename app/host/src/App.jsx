import "./App.css"
import Dashboard from "todo_components/Dashboard"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "user_components/Login"

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/",
    element: <Login />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
