import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const EventDetail = () => {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [event, setEvent]             = useState(null)
  const [registered, setRegistered]   = useState(false)
  const [loading, setLoading]         = useState(true)
  const [message, setMessage]         = useState('')

  useEffect(() => {
    // fetch event details
    axios.get(`http://localhost:5000/api/events/${id}`)
      .then(res => {
        setEvent(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // if logged in, check if already registered
    if (token) {
      axios.get('http://localhost:5000/api/events/my/registrations', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const alreadyRegistered = res.data.some(reg => reg.event._id === id)
        setRegistered(alreadyRegistered)
      })
      .catch(err => console.error(err))
    }
  }, [id, token])

  const handleRegister = async () => {
    if (!token) {
      navigate('/login')
      return
    }
    try {
      await axios.post(`http://localhost:5000/api/events/${id}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRegistered(true)
      setMessage('Successfully registered!')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong')
    }
  }

  const handleUnregister = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}/register`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRegistered(false)
      setMessage('Unregistered successfully.')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong')
    }
  }

  if (loading) return <p>Loading...</p>
  if (!event)  return <p>Event not found.</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>📅 {new Date(event.date).toDateString()}</p>
      <p>📍 {event.venue}</p>
      <p>👥 Capacity: {event.capacity}</p>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      {token ? (
        registered ? (
          <button onClick={handleUnregister} style={{ background: 'red', color: 'white', padding: '0.5rem 1rem' }}>
            Unregister
          </button>
        ) : (
          <button onClick={handleRegister} style={{ background: 'green', color: 'white', padding: '0.5rem 1rem' }}>
            Register
          </button>
        )
      ) : (
        <p>Please <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/login')}>login</span> to register for this event.</p>
      )}
    </div>
  )
}

export default EventDetail