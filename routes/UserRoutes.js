const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const userModel = require('../models/User');
const app = express();
const JWT_SECRET = 'your_secret_key'; 
app.use(express.json()); 

//http://localhost:3001/users
app.get('/users', async (req, res) => {
    const users = await userModel.find({});
    try {
        console.log(users)
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err);
    }
  });

//http://localhost:3001/user
app.post('/user', async (req, res) => {

    console.log(req.body)
    const user = new userModel(req.body);
    try {
      await user.save((err) => {
        if(err){
          res.send(err)
        }else{
          res.send(user);
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
});

// ================= User Login (Authentication) =================
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log (username, password);

  try {
      // Check if user exists
      console.log (username, password);
      const user = await userModel.findOne({ username });
      if (!user) {
        console.log ("trst");
          return res.status(400).send({ message: 'user not found' });
      }

      if (password != user.password){
          return res.status(400).send({ message: 'Invalid username or password' });
      }

      // Generate JWT token
      const token = jsonwebtoken.sign(
          { userId: user._id, username: user.username },
          JWT_SECRET,
          { expiresIn: '1h' } 
      );

      res.status(200).send({ message: 'Login successful', token });

  } catch (err) {
      console.error(err);
      res.status(500).send(err);
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Forbidden
      req.user = user;
      next();
  });
}

module.exports = app