var __dataPath     = 'data/';
var __usersFile    = 'users';
var __messagesFile = 'messages';

function makePromise(db, exp) {
    return new Promise(function (resolve, reject) {

        db.loadDatabase(function ( err ) {

            exports[exp] = db;

            err ? reject( err ) : resolve( db );

        });

    });
}

var Datastore = require('nedb');

exports.init = function(){
    return Promise.all([
        makePromise(new Datastore({filename : __dataPath + __usersFile}),    'users'),
        makePromise(new Datastore({filename : __dataPath + __messagesFile}), 'messages')
    ]);
};