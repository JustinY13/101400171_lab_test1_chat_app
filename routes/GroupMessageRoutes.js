const express = require('express');
const groupMessageModel = require('../models/GroupMessage');
const app = express();
app.use(express.json()); 

//http://localhost:3001/groupmessages
app.get('/groupmessages', async (req, res) => {
    const groupMessages = await groupMessageModel.find({});
    try {
        console.log(groupMessages)
        res.status(200).send(groupMessages);
    } catch (err) {
        res.status(500).send(err);
    }
  });
  

//http://localhost:3001/groupmessage
app.post('/groupmessage', async (req, res) => {

    console.log(req.body)
    const groupMessage = new groupMessageModel(req.body);
    try {
      await groupMessage.save((err) => {
        if(err){
          res.send(err)
        }else{
          res.send(groupMessage);
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
});

module.exports = app