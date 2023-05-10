import { Navigate, Outlet } from 'react-router-dom'
import { useUserContext } from '../context/user'
import Layout from '../components/Layout'

interface PrivateRouteProps {
  context?: string
}

const PrivateRoute = ({ context }: PrivateRouteProps) => {
  const { isAuthenticated } = useUserContext()
  return isAuthenticated ? (
    <Layout context={context}>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to='/login' />
  )
}

export default PrivateRoute
