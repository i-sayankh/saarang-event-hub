const express = require('express');
const router = express.Router();
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware')
const superAdminMiddleware = require('../middleware/superAdminMiddleware')

// Register a new user
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }
  if (!email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email' })
  }
  try {
        const checkemail = await User.findOne({ email });
        if (checkemail) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const hashedPassword = await bycrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Logout a user
router.post('/logout',authMiddleware, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

router.patch('/make-admin/:userId', superAdminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role: 'admin' },
      { new: true }
    )
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ message: `${user.username} is now an admin` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET all users — admin only
router.get('/users', superAdminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/remove-admin/:userId', superAdminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role: 'user' },
      { new: true }
    )
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ message: `${user.username} is now a regular user` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router;