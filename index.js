const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const userRouter = require('./routes/UserRoutes.js');
const privateMessageRouter = require('./routes/PrivateMessageRoutes.js');
const groupMessageRouter = require('./routes/GroupMessageRoutes.js')
const appRouter = require('./routes/AppRoutes.js')
const socketio = require('socket.io');
const { userInfo } = require('os');

const app = express();
app.use(express.json()); // Make sure it comes back as json

//TODO - Replace you Connection String here
const DB_NAME = "db_comp3133_labtest1"
const DB_USER_NAME = "justinyeh13"
const DB_PASSWORD = 'GBC13gbc!'
const CLUSTER_ID = 'ifuyg'
const DB_CONNECTION = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@cluster0.${CLUSTER_ID}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log('Success Mongodb connection')
}).catch(err => {
  console.log('Error Mongodb connection')
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));// This assumes you have an index.html
});
const serverPort = 3002;

app.use(userRouter);
app.use(privateMessageRouter);
app.use(groupMessageRouter);
app.use(appRouter);

app.listen(serverPort, () => { console.log('Server is running on http://localhost:3002/') });

const SOCKET_SERVER_PORT = 3003
const socketServer = app.listen(SOCKET_SERVER_PORT, () =>{
  console.log('Chat Server running on http://localhost:3003/')
})
const io = socketio(socketServer)

const PrivateMessageSchema = new mongoose.Schema({
  from_user: { type: String, required: true },
  to_user: { type: String, required: true },
  message: { type: String, required: true },
  date_sent: { type: Date, default: Date.now },
});
const PrivateMessage = mongoose.model('private message', PrivateMessageSchema);

const GroupMessageSchema = new mongoose.Schema({
  from_user: { type: String, required: true },
  room: { type: String, required: true },
  message: { type: String, required: true },
  //date_sent: { type: Date, default: Date.now },
});
const GroupPrivateMessage = mongoose.model('group message', GroupMessageSchema);

io.on('connection', (socket) => {

  console.log(`New Socket: ${socket.id}`)

  socket.on('disconnect', ()=> {
      console.log(`User disconnect ${socket.id}`)
  })

  socket.on('message', (data)=>{
      console.log(`Message from ${socket.id}: ${data}`)
  })

  socket.on('chat_message', async (data) => {
      data.clientId = socket.id
      console.log(JSON.stringify(data))
      io.emit('chat_message', data)
      //io.to(data.to_user).emit('chat_message', data);
      try {
        // Create a new message document
        const newMessage = new PrivateMessage({
          from_user: data.clientId,
          to_user: data.to_user,
          message: data.message,
        });
    
        await newMessage.save();        
      } catch (err) {
        console.error('Error saving message:', err);
      }
  })

  socket.on('join_group', (roomName) => {
      console.log(`User ${socket.id} joined room ${roomName}`)
      socket.join(roomName)
  })

  socket.on('leave_group', (roomName) => {
      socket.leave(roomName)
  })

  socket.on('group_message', async (data) => {
      console.log(`User ${socket.id} sent message to room ${data.group}`)
      data.senderId = socket.id

      try {
        // Create a new message document
        const newMessage = new GroupPrivateMessage ({
          from_user: socket.id,
          room: data.group,
          message: data.message,
        });
    
        // Save the message to MongoDB
        await newMessage.save();
    
      io.to(data.group).emit('group_message', data)

    } catch (err) {
      console.error('Error saving message:', err);
    }
  })


})

const corsOptions = {
  origin: 'http://localhost:3002', // Allow only port 3002 to access this server
  methods: 'GET,POST',             // Allowed methods
  allowedHeaders: 'Content-Type,Authorization', // Allow headers like Content-Type and Authorization
};

app.use(cors(corsOptions));