import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import EventList       from './pages/EventList'
import EventDetail     from './pages/EventDetail'
import Login           from './pages/Login'
import Signup          from './pages/Signup'
import MyRegistrations from './pages/MyRegistrations'
import Admin from './pages/Admin'
import ManageAdmins from './pages/ManageAdmins'

const Navbar = () => {
  const { user, logout } = useAuth()
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Link to="/">Events</Link>
      {user ? (
        <>
          <Link to="/my-registrations">My Registrations</Link>
          {user?.role === 'super_admin' && (<Link to="/manage-admins">Manage Admins</Link>)}
          {(user?.role === 'admin' || user?.role === 'super_admin') && (<Link to="/admin/add-event">+ Add Event</Link>)}
          <span>Hi, {user.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"                  element={<EventList />} />
          <Route path="/events/:id"        element={<EventDetail />} />
          <Route path="/login"             element={<Login />} />
          <Route path="/signup"            element={<Signup />} />
          <Route path="/my-registrations"  element={<MyRegistrations />} />
          <Route path="/admin/add-event"   element={<Admin />} />
          <Route path="/manage-admins"     element={<ManageAdmins />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App