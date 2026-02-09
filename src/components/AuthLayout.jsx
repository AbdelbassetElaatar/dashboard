import NavBar from './NavBar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <>
      <NavBar />
      <Sidebar/>
      <Outlet />
    </>
  )
}

export default AuthLayout
