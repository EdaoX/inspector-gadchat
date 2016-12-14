var {users, messages}                        = require('./database');
var {makeUser, changeUsername, changeColor}  = require('../models/user');
var {makeMessage}                            = require('../models/message');
var {makeCommand}                            = require('../models/command');

var io;

function onChatMessage(msg) {

    var socket = this;

    users.findOne({socketId: socket.id}, function (error, user) {

        if(user){

            if(msg.charAt(0) == '/'){
                // This is a command, so treat it as such
                var cmd = makeCommand(msg);

                if(cmd)
                    cmd.exec({socket, user});
                else
                    console.log(`Command not valid: ${msg}`);
            }
            else {
                messages.insert(makeMessage(msg, user), function (error, message) {
                    if(!error){
                        user.messages.push(message._id);
                        users.update({_id : user._id}, user, function (error) {
                            if(!error)
                                io.emit('chat message', {message, user});
                            else
                                console.log(`Error updating user ${user.username} from address ${address}: ${error}`);
                        });
                    }
                    else {
                        console.log(`Error saving message "${msg}": ${error}`);
                    }
                });
            }
        }
        else {
            console.log(`User not found!`);
        }

    });
}

function onChangeUsername(username){
    var socketId = this.id;
    users.findOne({socketId}, function (error, user) {

        if(user){
            changeUsername(user._id, username);
        }
        else {
            console.log(`User with id ${socketId} not found!`);
        }

    });
}

function onChangeColor(color) {

    var socketId = this.id;
    users.findOne({socketId}, function (error, user) {

        if(user){

            changeColor(user._id, color);

        }
        else {
            console.log(`User with id ${socketId} not found!`);
        }

    });

}

function onDisconnection() {
    //TODO
}

function onConnection(socket) {

    // Get the ip address of the connected user
    var address = socket.handshake.address;

    // Create the user if it doesn't exist
    users.findOne({address}, function (err, user) {
        if(user){

            // If user exists, update it's socket id
            users.update({_id : user._id}, { $set : { socketId : socket.id } }, function (error) {
                if(error) console.log(`Error updating user from address ${address}: ${error}`);
            });
        }
        else {

            // If user doesn't exist, insert it
            users.insert(makeUser(address, socket.id), function (error) {
                if(error) console.log(`Error saving user from address ${address}: ${error}`);
            });
        }
    });

    //Load up all messages and send them to connected socket for visualization
    messages.find({}).sort({timestamp : 1}).exec(function(error, messages){
        Promise.all(messages.map(function (message) {
            return new Promise(function (resolve, reject) {
                users.findOne({_id : message.userId}, function (error, user) {

                    if(!error){

                        message.user = user;

                        resolve(message);

                    }
                    else reject(error);

                });
            });
        })).then(function (filledMessages) {
            socket.emit('messages loaded', filledMessages);
        });

    });

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