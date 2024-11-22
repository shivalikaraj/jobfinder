import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Login from './modules/Auth/pages/Login'
import Register from './modules/Auth/pages/Register'
import Jobs from './modules/Job/pages/Jobs'
import Profile from './modules/Profile/pages/Profile'
import JobDescription from './modules/Job/pages/JobDescription'
import ProtectedRoute from './components/ProtectedRoute'
import Browse from './modules/Job/pages/Browse'
import CompanyProfile from './modules/Profile/pages/CompanyProfile'
import Applicants from './modules/Application/pages/Applicants'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/browse',
    element: <Browse />
  },
  {
    path: '/jobs',
    element: <Jobs />
  },
  {
    path: '/job/:id',
    element: <JobDescription />
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute type="user">
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: '/company-profile',
    element: (
      <ProtectedRoute type="company">
        <CompanyProfile />
      </ProtectedRoute>
    )
  },
  {
    path: '/job/:id/applicants',
    element: (
      <ProtectedRoute type="company">
        <Applicants />
      </ProtectedRoute>
    )
  }
])

function App() {


  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
