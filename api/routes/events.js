const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware')

router.post('/', adminMiddleware, async (req, res) => {
  const { title, description, date, venue, capacity } = req.body
  if (!title || !description || !date || !venue) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  if (capacity && capacity < 1) {
    return res.status(400).json({ message: 'Capacity must be at least 1' })
  }
  try {
    const event = await Event.create({ title, description, date, venue, capacity })
    res.status(201).json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/',  async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:id/register', authMiddleware, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        const registrationCount = await Registration.countDocuments({ event: req.params.id })
        if (registrationCount >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' })
        }
        const already = await Registration.findOne({ user: req.user.id, event: req.params.id });
        if (already) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }
        const registration = await Registration.create({ user: req.user.id, event: req.params.id });
        res.status(201).json(registration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id/register', authMiddleware, async (req, res) => {
    try {
        const registration = await Registration.findOneAndDelete({ user: req.user.id, event: req.params.id });
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }
        res.json({ message: 'Unregistered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/my/registrations', authMiddleware, async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.user.id }).populate('event');
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;