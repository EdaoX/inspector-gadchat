exports = module.exports = {

    makeUser : function ( address, socketId ) {
        return {
            username : address,
            address  : address,
            socketId : socketId,
            messages : [],
            color    : '#000000'
        }
    },

    changeUsername : function (id, newUsername, broadcast = false) {

        var {users} = require('../services/database');

        users.findOne({_id : id}, (err, user) => {

            if(!err && user){
                var oldUsername = user.username;

                users.update({_id : id}, { $set : {username : newUsername}}, (err, numReplaced) => {

                    if(broadcast && !err && (numReplaced > 0)){

                        var {io} = require('../services/sockets');
                        io.emit('username change', `User '${oldUsername}' changed name to '${newUsername}'`);

                    }
                });
            }

        });

    },

    changeColor : function (id, newColor) {

        var {users} = require('../services/database');

        users.update({_id : id}, { $set : {color : newColor}});

    }

};