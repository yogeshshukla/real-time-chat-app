var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var room = 'yogesh'; // for dummy only
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/chat/:id', function(req, res){
  room = req.params.id;
  
  res.sendFile(__dirname + '/index.html');
  
});
var rooms = [];
var numUsers = 0;
io.on('connection', function(socket){
	socket.room = room;
	socket.join(room);
	socket.on('chat message', function(msg){
		 io.sockets.in(socket.room).emit('chat message', {msg:msg, user:socket.username});
	});
	socket.on('add user', function(user){
		socket.username = user;
		++numUsers;
		io.sockets.in(socket.room).emit('broadcast user added', {
	      user: socket.username
	    });
	});
	// when the client emits 'typing', we broadcast it to others
	socket.on('typing', function () {
	    io.sockets.in(socket.room).emit('typing', {
	      user: socket.username
	    });
	});
	socket.on('disconnect', function () {
    		 io.sockets.in(socket.room).emit('disconnect', {
		      user: socket.username
		    });
  	});
	 
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
