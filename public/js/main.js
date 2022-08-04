//loads script after html

//initializes socket.io
const socket = io();

//gets the room from the URL
const room = window.location.pathname;

document.getElementById("roomName").innerHTML = room.replace('/', "");

//listens for messages for that room
socket.on('messageOut'+ room, text => {

    //creates a list element and puts it at the top(bottom) of unordered list
    const el = document.createElement('li');
    el.innerHTML = text;
    document.getElementById("messageBoard").insertBefore(el, document.getElementById("messageBoard").firstChild);
});

//when the send button is clicked it will send a new packet
document.getElementById('messageIn').onclick = () => {

    //gets values from inputs
    const text = document.getElementById('message').value.trim();
    const name = document.getElementById('name').value.trim() || "Anonymous";

    //as long as the text isn't empty it will send a packet back to the server
    if(text != ""){
        socket.emit('message', {name: name, message: text, room: room});
    }
}


//if the user hits enter it will call the onclick method
document.getElementById('message').onkeydown = (event) => {
    if(event.key == "Enter"){
        document.getElementById('messageIn').onclick();
    }
}
