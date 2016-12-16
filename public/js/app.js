var socket 		= io();
var $msgInput 	= $('#m');
var $msgList 	= $('#messages');
var notification = null;

var notificationTimer = 5000;

function addMessageToList( msg, username, color )
{
	var $li = $('<li>');
	$li.append($('<strong>').text(username + ': '));
	$li.append($('<span>').css('color', color).text(msg));
	$msgList.append($li);
	$msgList.scrollTop($msgList[0].scrollHeight);
	
}

function sendMessage( msg )
{
	socket.emit('chat message', msg);
}

function handleNewMessage( bundle )
{
	msg 	 = bundle.message.body;
	username = bundle.user.username;
	color 	 = bundle.user.color;
	sendNotification(msg);
	addMessageToList( msg, username, color );
}

function handleNewServerMessage( msg ) {
	addMessageToList(msg, 'Server', '#81d944');
}

function handleMessageList( messageList ){
    if(messageList)
        messageList.forEach(function (message) {
            addMessageToList(message.body, message.user.username || '---', message.color);
        });
}

function sendNotification( msg ){
	if(notification) notification.close();
	notification = new Notification('Inspector GadChat', {
      icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
      body: msg,
    });
    setTimeout(function(){ notification.close(); }, notificationTimer);
}

function changeUsername( username ) {
	socket.emit('change username', username);
}

function changeColor( color ) {
	socket.emit('change color', color);
}

$('form').submit(function(){
	var msg = $msgInput.val().trim()
	if(msg){
		sendMessage(msg);
		$msgInput.val('');
	}
	return false;
});

socket.on('chat message', handleNewMessage);
socket.on('messages loaded', handleMessageList);
socket.on('server message', handleNewServerMessage)

if (Notification && Notification.permission !== "granted")
    Notification.requestPermission();