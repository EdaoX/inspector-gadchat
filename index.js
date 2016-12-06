var express 		  = require('express');
var app 			  = express();
var http 			  = require('http').Server(app);
var { sockets }       = require('./services/sockets');

var {chat}            = require('./routes/index');

app.use(express.static('public'));

// Setup Routes
app.get('/', chat);

// Setup Socket Listeners
sockets(http);

http.listen(3000, function(){
	console.log('listening on *:3000');
});