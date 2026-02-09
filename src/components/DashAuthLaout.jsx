import NavBar from './NavBar'
import SideBar from '../Pages/woocommerce/components/sidebar'
import { Outlet } from 'react-router-dom'

const DashAuthLayout = () => {
  return (
    <>
      <NavBar />
      <SideBar/>
      <Outlet />
    </>
  )
}

export default DashAuthLayout
