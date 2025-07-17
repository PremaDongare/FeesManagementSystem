// routes/profile.js
// Profile routes: get, update, pay fees (protected)

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get current user's profile
router.get('/', auth, async (req, res) => {
  res.json(req.user);
});

// Update current user's name/email
router.put('/', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }
    req.user.name = name;
    req.user.email = email;
    await req.user.save();
    res.json({ message: 'Profile updated.', user: req.user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Pay fees
router.post('/pay', auth, async (req, res) => {
  try {
    if (req.user.feesPaid) {
      return res.status(400).json({ message: 'Fees already paid.' });
    }
    req.user.feesPaid = true;
    await req.user.save();
    // Emit real-time event
    const io = req.app.get('io');
    io.emit('feesPaid', { userId: req.user._id, name: req.user.name, email: req.user.email });
    res.json({ message: 'Fees paid successfully.', user: req.user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 