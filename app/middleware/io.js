var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;
users = {};
io.on('connection', function(socket){

    socket.on('addUserLogged', (userLogged) => {
        socket.user = userLogged._id;
        if (!users[userLogged._id]) {
            users[userLogged._id] = new Set();
            users[userLogged._id].add(socket);
        }
    })
    socket.on("disconnect", function(data) {
        console.log("A user disconnected");
        if (users[socket.user]) {
            users[socket.user].delete(socket);
            if (users[socket.user].size === 0) {
                delete users[socket.user];
            }
        }
    });
    console.log('A user connected');
});

socketApi.sendNotification = function(notification, authorId) {
    console.log("sending resource");
    for (var key in users) {
        var obj = users[key];
        if(key!=authorId) {
            for(let userSet of obj) {
                userSet.emit('get_info', notification, authorId);
            }
        }
    }
    io.sockets.emit('get_infoUpdate', notification, authorId);
}
socketApi.sendNotificationRating = function(notification, authorId) {
    console.log("sending rating");
    for (var key in users) {
        var obj = users[key];
        if(key == authorId) {
            for(let userSet of obj) {
                userSet.emit('get_infoRating', notification, authorId);
            }
        }
    }
    io.sockets.emit('get_infoUpdateRating', notification, authorId);

}

socketApi.sendNotificationComments = function(notification, authorId) {
    console.log("sending comment");
    for (var key in users) {
        var obj = users[key];
        if(key == authorId) {
            for(let userSet of obj) {
                userSet.emit('get_infoComments', notification, authorId);
            }
        }
    }
    io.sockets.emit('get_infoUpdateComments', notification, authorId);

}

module.exports = socketApi;