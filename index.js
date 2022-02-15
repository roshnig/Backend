const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
app.use(cors());

const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.get('/', (req, res) => {
    res.send('Its working from server')
});

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    //here join_room is event name which we have created in frontend when someone joins a chat
    //and socket is connecting to BE and FE so we can access that evt here
    socket.on('join_room', (data) => {
        socket.join('data');
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
        io.emit('receive_user', data)
    })

    // here is another evt send_message which will have chat data
    socket.on('send_message', (data) => {
        // console.log(data)
        // now whenever this new msg comes here from any user, we need to emit it to all users, so we need to send this to frontend
        // this data will be displayed in the chatlist ul in frontend

        //socket.to(data.room).emit('receive_message', data) // we don't have room logic so will not work
        io.emit('receive_message', data)  // this will emit data to everyone
    })

    // when someone leaves the chat room
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
    })
});

server.listen(4500, () => {
    console.log('listening on *: http://localhost:4500');
});