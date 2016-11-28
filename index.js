var express 		  = require('express');
var app 			  = express();
var http 			  = require('http').Server(app);
var io 				  = require('socket.io')(http);

var chatWindowHandler = require('./App/Controllers/ChatWindow');
var User 			  = require('./App/Models/User');
var Message 		  = require('./App/Models/Message');

// List of know users
var users   = {};

app.use(express.static('public'));

app.get('/', chatWindowHandler);

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

http.listen(3000, function(){
	console.log('listening on *:3000');
});