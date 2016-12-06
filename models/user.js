exports = module.exports = {

    makeUser : function ( address, socketId ) {
        return {
            username : address,
            address  : address,
            socketId : socketId,
            messages : [],
            color    : '#000000'
        }
    }

};