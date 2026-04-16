const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

const router = express.Router();

// ── Utility: Generate JWT ───────────────────────────────────────────
const generateToken = (id) => 
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/register ─────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email is already registered.' });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/login ────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("Login request body:", req.body);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    console.log("User found:", user);

    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Your account is deactivated. Please contact the admin.' });
    }

    const match = await user.matchPassword(password);
    console.log("Password match result:", match);

    if (!match) return res.status(400).json({ message: 'Invalid email or password.' });

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/me ────────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Fetch user error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/auth/profile ───────────────────────────────────────────
router.put('/profile', protect, upload.single('profilePic'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.name) user.name = req.body.name;
    if (req.body.bio)  user.bio  = req.body.bio;
    if (req.file)      user.profilePic = req.file.filename;

    await user.save();
    const updated = await User.findById(user._id).select('-password');
    res.json(updated);
  } catch (err) {
    console.error('Profile update error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/auth/change-password ──────────────────────────────────
router.put('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new password are required.' });
  }

  try {
    const user = await User.findById(req.user._id);
    const match = await user.matchPassword(currentPassword);
    console.log("Change password match result:", match);

    if (!match) return res.status(400).json({ message: 'Current password is incorrect.' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
