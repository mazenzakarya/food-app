const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');

// Create a new user

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
        email,
        password: hashedPassword
    });
    let token = jwt.sign({
        id: newUser._id,
        email: newUser.email
        }, process.env.JWT_SECRET, { expiresIn: '1h' });  
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', token });
});

module.exports = router;