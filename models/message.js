exports = module.exports = {

    makeMessage : function (message, user) {

        return {
            body      : message,
            userId    : user._id,
            color     : user.color,
            timestamp : new Date()
        }

    },

    makeSpokenMessage : function ( message ){
    	if(message.length > 100) message = message.substring(0, 100);
    	return message;	//TODO - Better implementation
    }

};
