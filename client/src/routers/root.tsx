import { createBrowserRouter } from 'react-router-dom'
import PrivateRoute from './Private-Route'
import HomeRouter from '../components/Home-Router'
import LinkShortener from '../views/Link-Shortener'
import ContactList from '../views/Contact-List'
import JobManagement from '../views/Job-Management'
import Login from '../views/Login'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <HomeRouter />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/shortener',
    element: <PrivateRoute context='url' />,
    children: [
      {
        path: '',
        element: <LinkShortener />,
      },
    ],
  },
  {
    path: '/contact-list',
    element: <PrivateRoute context='contact' />,
    children: [
      {
        path: '',
        element: <ContactList />,
      },
    ],
  },
  {
    path: '/job-management',
    element: <PrivateRoute context='job' />,
    children: [
      {
        path: '',
        element: <JobManagement />,
      },
    ],
  },
])

export default routes
