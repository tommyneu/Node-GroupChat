//requires express and initializes app server
const express = require('express');
const helmet = require('helmet');
const volleyball = require('volleyball');
const app = express();

// requires path
const path = require('path');

//creates a http server using the app server
const http = require('http').createServer(app);

//creates io object to be used to emit TCP links
const io = require('socket.io')(http, {
    cors: {origin: "*"}
});

//creates a static folder that will allow the browser to load everything from public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(volleyball)
app.use(helmet());

//allows the user to type in whatever id they want and still load the page
app.get('/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})


//checks to see if the user connects to socket
io.on('connection' , (socket) => {

    //logs that they connected and what their id is
    console.log(`${socket.id} connected`);

    //listens for a message emit and will run arrow function if it did
    socket.on('message', (arg) => {

        //gets values from arg
        const name = arg.name;
        const msg = arg.message;
        const room = arg.room;

        //console logs msg
        console.log(`${name}: ${msg} in room ${room}`);

        //emits new message out for specific room and creates the message to be received by user
        io.emit('messageOut' + room, `${name}: ${msg}`);
    });


    //when the person disconnects it will log that as well
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    });
});


//gets the port the server will be on
const PORT = process.env.PORT || 5050;

//listens to that port for requests
http.listen(PORT, () => console.log(`Server started on port ${PORT}`));