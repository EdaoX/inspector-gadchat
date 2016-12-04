function Message( message, user, color ){

	var user 	  = user;
	var msg 	  = message;
	var timestamp = new Date();
	var color 	  = color || '#000000';

	this.getMessage = function () {
		return message;
	}

	this.getTimestamp = function() {
		return new Date(timestamp.getTime());
	}

	this.setColor = function ( newColor ) {
		color = newColor;
	}

	this.serialize = function(){
		return {
			username  : user.getUsername(),
			color	  : color,
			message   : message,
			timestamp : message.toString()
		}
	}
}

exports = module.exports = Message;