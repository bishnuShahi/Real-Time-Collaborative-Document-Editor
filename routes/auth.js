const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, password: hashedPassword});
        await user.save();

        console.log('Received registration request for username:', username);
        console.log('Password provided:', !!password);
        console.log('Hashed password:', hashedPassword);

        console.log('User saved to database:', user.toObject());

        res.status(201).json({message: 'User registered successfully!'});
    }
    catch (error) {
            console.error('Registration error:', error);
            if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error registering user', details: error.message });
        }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = User.findOne({ username });
        if (!user) {
            return res.status(400).json({error: 'User not found'});
        }

        console.log('Stored password:', user.password);
        console.log('Provided password:', password);

        if (typeof user.password === 'undefined') {
            return res.status(400).json({ error: 'User password is not set' });
          }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({error: 'Invalid credentials'});
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set');
            return res.status(500).json({ error: 'Internal server error' });
          }

        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token});
    }
    catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in', details: error.message });
    }
});

module.exports = router;