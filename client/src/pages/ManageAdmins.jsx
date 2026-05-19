import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const ManageAdmins = () => {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token || user?.role !== 'super_admin') {
      navigate('/')
      return
    }
    axios.get('https://saarang-event-hub-5c2b.onrender.com/api/auth/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUsers(res.data)
      setLoading(false)
    })
    .catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [token])

  const makeAdmin = async (userId) => {
    try {
      const res = await axios.patch(
        `https://saarang-event-hub-5c2b.onrender.com/api/auth/make-admin/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage(res.data.message)
      setUsers(users.map(u => u._id === userId ? { ...u, role: 'admin' } : u))
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to promote user')
    }
  }

  const removeAdmin = async (userId) => {
    try {
      const res = await axios.patch(
        `https://saarang-event-hub-5c2b.onrender.com/api/auth/remove-admin/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage(res.data.message)
      setUsers(users.map(u => u._id === userId ? { ...u, role: 'user' } : u))
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to remove admin')
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Manage Admins</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Username</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Role</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{u.username}</td>
              <td style={{ padding: '0.5rem' }}>{u.email}</td>
              <td style={{ padding: '0.5rem' }}>{u.role}</td>
              <td style={{ padding: '0.5rem' }}>
                {u._id === user.id ? (
                  <span style={{ color: 'blue' }}>You (Superadmin)</span>
                ) : u.role === 'admin' ? (
                  <button
                    onClick={() => removeAdmin(u._id)}
                    style={{ background: 'red', color: 'white', padding: '0.25rem 0.75rem' }}
                  >
                    Remove Admin
                  </button>
                ) : u.role === 'user' ? (
                  <button
                    onClick={() => makeAdmin(u._id)}
                    style={{ background: 'green', color: 'white', padding: '0.25rem 0.75rem' }}
                  >
                    Make Admin
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ManageAdmins