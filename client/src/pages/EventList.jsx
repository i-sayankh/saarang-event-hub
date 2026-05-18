import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const EventList = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:5000/api/events')
      .then(res => {
        setEvents(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading events...</p>

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Upcoming Events</h1>
      {events.map(event => (
        <div
          key={event._id}
          onClick={() => navigate(`/events/${event._id}`)}
          style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', cursor: 'pointer' }}
        >
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>📅 {new Date(event.date).toDateString()}</p>
          <p>📍 {event.venue}</p>
          <p>👥 Capacity: {event.capacity}</p>
        </div>
      ))}
    </div>
  )
}

export default EventList