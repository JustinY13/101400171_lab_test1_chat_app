const express = require('express');
const privateMessageModel = require('../models/PrivateMessage');
const app = express();
app.use(express.json()); 

//http://localhost:3001/privatemessages
app.get('/privatemessages', async (req, res) => {
    const privateMessages = await privateMessageModel.find({});
    try {
        console.log(privateMessages)
        res.status(200).send(privateMessages);
    } catch (err) {
        res.status(500).send(err);
    }
  });

//http://localhost:3002/privatemessage
app.post('/privatemessage', async (req, res) => {

    console.log(req.body)
    const privateMessage = new privateMessageModel(req.body);
    try {
      await privateMessage.save((err) => {
        if(err){
          res.send(err)
        }else{
          res.send(privateMessage);
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
});

module.exports = app