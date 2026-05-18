import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const MyRegistrations = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    axios.get('http://localhost:5000/api/events/my/registrations', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setRegistrations(res.data)
      setLoading(false)
    })
    .catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [token])

  const handleUnregister = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}/register`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRegistrations(registrations.filter(reg => reg.event._id !== eventId))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Registrations</h1>
      {registrations.length === 0 ? (
        <p>You haven't registered for any events yet. <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/')}>Browse events</span></p>
      ) : (
        registrations.map(reg => (
          <div key={reg._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h2>{reg.event.title}</h2>
            <p>{reg.event.description}</p>
            <p>📅 {new Date(reg.event.date).toDateString()}</p>
            <p>📍 {reg.event.venue}</p>
            <button
              onClick={() => handleUnregister(reg.event._id)}
              style={{ background: 'red', color: 'white', padding: '0.5rem 1rem' }}
            >
              Unregister
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default MyRegistrations