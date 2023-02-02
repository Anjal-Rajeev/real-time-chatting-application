const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const path = require('path')


const app = new express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
      origins: ['http://localhost:4200']
    }
  });

const PORT = process.env.PORT || 5000;

require('./middlewares/mongoDB')
const messageModel = require('./models/message')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(logger('dev'))

app.use(express.static('./dist/frontend')); 

var room1 = ""
var room2 = ""
var room = ""
var data


// function for creating or finding chat rooms 
async function findRoom(user1, user2){
  console.log(user1, "-----", user2);
  room1 = `${user1}-${user2}`;
  room2 = `${user2}-${user1}`;
  data =await messageModel.findOne({ $or: [ {room : room2}, { room: room1 } ] })
  // console.log("db data ",data);
  if(data == null){
    console.log("empty");
    newRoom = new messageModel({room : room1, messages:[]});
    savedRoom =await newRoom.save();
    console.log("new  "  ,savedRoom.room);
    room = savedRoom
    data = savedRoom
    // console.log(room);
  }else{
    room = data
    // console.log("not empty" , room);
  }
}

// for storing the incoming messages to DB
async function storeMessage(chatRoom, msg){
  try {
    updatedMsg =await messageModel.updateOne({ room : chatRoom },{ $push: { messages : msg } })
  } catch (error) {
    console.log(error);
  }
}

io.on('connection', (socket)=>{
    console.log('A user connected',socket.id);
    socket.on('register',async (userDetails) => {
     
      // Create a unique room name
      console.log(userDetails);
      await findRoom(userDetails.sender, userDetails.recipient)           // function for creating or finding chat rooms

      // Join the room
      socket.join(room.room);
      console.log("room from old msg ",room);
      await io.to(room.room).emit('old_message',data.messages)            // send the old chats to fronend
      // console.log("re sending msg ", data.messages);
  }); 

  socket.on('send_message',async (msg) => {                               // receiving the messages that coming from frontend
      console.log("incoming message=> ",msg);


      // Emit the message to the specific room
      console.log("send msg ", room.room);
      await io.to(room.room).emit('new_message', msg);                    // returning the messages to frontend
      await storeMessage(room.room, msg)
  });



  // Handle disconnections
    socket.on('disconnect', () => {
      console.log('User disconnected'); 
    });
})




// redirect routes according to the url

const loginApi = require('./routes/loginApi')
app.use('/api/login', loginApi)

const signupApi = require('./routes/signupApi')
app.use('/api/signup', signupApi)

const chatApi = require('./routes/chatApi');
app.use('/api/user', chatApi)


app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
}); 


http.listen(PORT, ()=>{
    console.log("Server is running on PORT",PORT);
})  
