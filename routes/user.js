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

// Login user
router.post('/login', async (req, res) => { 
        const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    if (user && (await bcrypt.compare(password, user.password))){
        let token = jwt.sign({
            id: user._id,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: '1h' });  
        return res.status(200).json({ message: 'Login successful', token });
    }
    else {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
});

module.exports = router;