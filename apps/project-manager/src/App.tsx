import CreateProjectFolder from './components/CreateProjectFolder'
import './App.css'
import { useAuthorization } from './context/Authorization.context'
import { UnauthorizedUser } from './components/auth-pages/UnauthorizedUser'
import { NavBar } from './components/nav-bar/NavBar'

function App() {
  const { isAuthorized } = useAuthorization()

  return (
    <>
      <NavBar></NavBar>
      {isAuthorized &&
        <CreateProjectFolder></CreateProjectFolder>
      }
      {!isAuthorized &&
        <UnauthorizedUser />
      }
    </>
  )
}

export default App
