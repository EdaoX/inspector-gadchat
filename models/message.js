exports = module.exports = {

    makeMessage : function (message, user) {

        return {
            body      : message,
            userId    : user._id,
            color     : user.color,
            timestamp : new Date()
        }

    }

};
