var {User, Message} = require('../models');

function sockets (server){

    // List of known users
    var users   = {};

    var io = require('socket.io')(server);

    // Handle a user connecting to the server
    io.on('connection', function(socket){

        // Get the ip address of the connected user
        var address = socket.handshake.address;

        // Create the user if it doesn't exist
        users[address] = users[address] || new User(address);

        var user = users[address];

        // io.emit('chat message', '*** Utente Connesso: ' + user.username + ' ***');

        socket.on('chat message', function(msg){
            var message = new Message(msg, user, user.getColor());
            user.addMessage(message);
            io.emit('chat message', message.serialize());
        });

        socket.on('change username', function(username) {
            user.setUsername(username);
        });

        socket.on('change color', function(color) {
            user.setColor(color);
        });

        socket.on('disconnection', function(){
            // io.emit('chat message', '*** Utente Disconnesso: ' + user.username + ' ***');
        });

    });

}

exports = module.exports = sockets;