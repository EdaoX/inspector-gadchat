var express 		  = require('express');
var app 			  = express();
var http 			  = require('http').Server(app);

var {chat}            = require('./routes/index');
var database          = require('./services/database');

app.use(express.static('public'));

// Setup Routes
app.get('/', chat);

database.init().then(function () {

    var { sockets } = require('./services/sockets');

    // Setup Socket Listeners
    sockets(http);

    http.listen(3000, function(){
        console.log('listening on *:3000');
    });

});