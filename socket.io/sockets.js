var {User, Message} = require('../models');

// List of known users
var users = {};

var io;

function onChatMessage(msg) {
    user = users[this.id];
    var message = new Message(msg, user, user.getColor());
    user.addMessage(message);
    io.emit('chat message', message.serialize());
}

function onChangeUsername(username){
    users[this.id].setUsername(username);
}

function onChangeColor(color) {
    users[this.id].setColor(color);
}

function onDisconnection() {
    //TODO
}

function onConnection(socket) {

    // Get the ip address of the connected user
    var address = socket.handshake.address;

    // Create the user if it doesn't exist
    users[socket.id] = users[socket.id] || new User(address);

    // io.emit('chat message', '*** Utente Connesso: ' + user.username + ' ***');

    socket.on('chat message', onChatMessage.bind(socket));

    socket.on('change username', onChangeUsername.bind(socket));

    socket.on('change color', onChangeColor.bind(socket));

    socket.on('disconnection', onDisconnection.bind(socket));

}

function sockets (server){

    io = require('socket.io')(server);


    // Handle a user connecting to the server
    io.on('connection', onConnection);

    exports.io = io;
}

exports.sockets = sockets;