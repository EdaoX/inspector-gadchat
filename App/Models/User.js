function User ( address ){

	var address   = address;
	var username  = address;
	var color 	  = '#000000';
	var messages  = [];

	this.setUsername = function ( newUsername ) {
		username = newUsername;
	}

	this.getUsername = function () {
		return username;
	}

	this.setColor = function ( newColor ) {
		color = newColor;
	}

	this.getColor = function () {
		return color;
	}

	this.addMessage = function ( message ) {
		messages.push(message);
	}
}

exports = module.exports = User;