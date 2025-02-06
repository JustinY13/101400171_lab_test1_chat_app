const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const socketio = require('socket.io')
//const User = require('../models/user');

const router = express.Router();

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/register.html'));// This assumes you have an index.html
  });

// http://localhost:3002/group
router.get("/chat", (req, res) => {
    //res.redirect('http://localhost:3003/chat');
    res.sendFile(path.join(__dirname, '../client/private_chat.html'));
})

router.get("/groupchat", (req, res) => {
  //res.redirect('http://localhost:3003/chat');
  res.sendFile(path.join(__dirname, '../client/group_chat.html'));
})

router.post('/register', async (req, res) => {
  const { username, firstname, lastname, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, firstname, lastname, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).send('User created');
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/index', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).send('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');

  const token = jwt.sign({ userId: user._id }, 'secretkey');
  res.json({ token });
});

module.exports = router;
