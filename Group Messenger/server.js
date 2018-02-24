var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(4000, function(){
    console.log('Listening for requests on port 4000');
});
connections=[];
users=[];

// Static files
app.use(express.static('public'));

// Socket setup & pass server
var io = socket(server);
io.on('connection', function (socket) {

    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    //Disconnect
    socket.on('disconnect', function (data) {

        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length)
    });

    //Send Message
    socket.on('send message', function (data) {
        io.sockets.emit('new message', {msg: data})
    });

    //New User
    socket.on('new user', function (data, callback) {
        callback(true);
        socket.username=data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }
});