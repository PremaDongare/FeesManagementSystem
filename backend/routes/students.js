
// Route to get all students (protected)
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all students
router.get('/', auth, async (req, res) => {
  try {
    const students = await User.find().select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 