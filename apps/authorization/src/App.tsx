import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import { StartAuth } from './components/startAuth'
import { Redirect } from './components/Redirect'

function App() {
  const router = createBrowserRouter([
    {
      path: "/start",
      element: <StartAuth />,
    },
    {
      path: "/finish",
      element: <Redirect />,
    },
  ],{
    basename: '/authorization'
  })
  return (
    <RouterProvider router={router}/>
  )
}

export default App
