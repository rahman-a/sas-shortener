import { useLocation, Navigate } from 'react-router-dom'
import { useUserContext } from '../context/user'
const HomeRouter = () => {
  const { isAuthenticated } = useUserContext()
  const pathname = useLocation().pathname
  return (
    <div>
      {isAuthenticated ? (
        <Navigate to={pathname === '/' ? '/shortener' : pathname} />
      ) : (
        <Navigate to='/login' />
      )}
    </div>
  )
}

export default HomeRouter
