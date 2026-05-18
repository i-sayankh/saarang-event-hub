import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const AdminAddEvent = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', date: '', venue: '', capacity: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError]     = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      navigate('/login')
      return
    }
    try {
      await axios.post('https://saarang-event-hub-5c2b.onrender.com/api/events', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('Event created successfully!')
      setError('')
      setForm({ title: '', description: '', date: '', venue: '', capacity: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event')
      setMessage('')
    }
  }

  if (!token) return <p>You must be logged in to access this page.</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Add New Event</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error   && <p style={{ color: 'red'   }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Title</label><br />
          <input name="title" value={form.title} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Description</label><br />
          <textarea name="description" value={form.description} onChange={handleChange} required style={{ width: '100%', fontFamily: 'inherit', fontSize: 'inherit' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Date</label><br />
          <input name="date" type="date" value={form.date} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Venue</label><br />
          <input name="venue" value={form.venue} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Capacity</label><br />
          <input name="capacity" type="number" value={form.capacity} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <button type="submit" style={{ background: 'green', color: 'white', padding: '0.5rem 1rem' }}>
          Create Event
        </button>
        <button type="button" onClick={() => navigate('/')} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          Back to Events
        </button>
      </form>
    </div>
  )
}

export default AdminAddEvent