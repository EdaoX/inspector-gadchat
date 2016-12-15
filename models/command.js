function Command(command, exec, acceptedArgs = null, args = '') {
    this.command = command;
    this.args    = (args && acceptedArgs) ? new ArgumentList( args, acceptedArgs ) : null;

    this.exec    = function ( params = null ) {
        return this.args ? exec(this.args, params) : exec(params);
    };
}

function ArgumentList( args , acceptedArgs ) {

    var _args = {};

    for(var key in acceptedArgs){
        if(acceptedArgs.hasOwnProperty(key)){
            matching = acceptedArgs[key];

            var regex = null;

            key = key.trim();

            // Check if the key is a flag, in which case "matching" is the value to assign in case of presence
            if(key.match(/^\(.+\)$/))   // E.g: (-y) means "Just check if -y is present, don't take any parameters"
            {
                key = key.replace(/^\(|\)$/gm, ''); //Removes surrounding parenthesis
                regex = new RegExp(`${key}`);
                _args[key] = regex.exec(args) ? matching : false;
            }
            else if (key.match(/^-\w+/)){           //If key begins with -, look it up inside the arguments string along with the match pattern
                regex = new RegExp(`${key}\s+${matching}`);
                _args[key] = regex.exec(args) || false;
            }
            else {
                regex = new RegExp(`${matching}`);  //If key doesn't begin with -, only look for the match pattern
                _args[key] = regex.exec(args) || false;
            }
        }
    }

    this.has = function (arg) {
        return Boolean(_args[arg]);
    };

    this.matchesOf = function (arg) {
        return this.has(arg) && typeof _args[arg] == 'object' ? _args[arg].filter((el, index) => index > 0) : [];   //Excludes full match from return
    };

    this.getValue = function (arg) {
        return _args[arg];
    }

}

var commands = {};

commands.changeUsername = commands.cu = function (args) {

    var acceptedArgs = {
        'username' : "'([\\w\\s]+)'",
        '-y'       : true
    };

    function exec(args, params) {

        if(!params.user || !params.user._id) return false;
        if(!args.has('username'))            return false;

        var username = args.matchesOf('username')[0];

        var {changeUsername} = require('./user');

        changeUsername(params.user._id, username, args.has('-y'))
    }

    return new Command('changeUsername', exec, acceptedArgs, args);
};

commands.changeColor = function (args) {

    var acceptedArgs = {
        'color' : "'(.+)'"
    };

    function exec(args, params) {
        if(!params.user || !params.user._id) return false;
        if(!args.has('color'))               return false;

        var {changeColor} = require('./user');
        changeColor(params.user._id, args.matchesOf('color')[0]);
    }

    return new Command('changeColor', exec, acceptedArgs, args);

}

exports = module.exports = {
    makeCommand : function (commandString) {
        var fields = /^\/(\w+)\s+(.*)\s*/.exec(commandString);
        if(!fields) return false;
        var command = fields[1];
        var args    = fields[2];
        return commands[command] ? commands[command](args) : false;
    }
};