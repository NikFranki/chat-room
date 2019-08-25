const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'dist')))

// 在线用户
let onlineUsers = {};
// 在线用户人数
let onlineCount = 0;

io.on('connection', function(socket) {
    console.log('user connection');

    // 监听客户端首次进来，获取在线人数
    socket.on('onlineUsers', function() {
        io.emit('onlineUsers', onlineUsers);
    });

    // 监听客户端的登录
    socket.on('login', function(obj) {

        // 用户id为socketid
        socket.id = obj.uid;

        // 如果没有这个用户，则添加进在线用户
        if (!onlineUsers.hasOwnProperty(obj.uid)) {
            onlineUsers[obj.uid] = obj.username;
            onlineCount++;
        }

        console.log(onlineUsers, onlineCount);
        // 向客户端发送登录事件，同时发送当前在线用户和在线人数及登录用户
        io.emit('login', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj})
        console.log(obj.username+'加入了群聊');
    });

    // 监听客户端退出登录
    socket.on('logout', function(obj) {
        console.log('要退出了', obj, socket.id);
        // 若存在这个用户
        if (onlineUsers.hasOwnProperty(obj.uid)) {
            let obj = {uid: obj.uid, username: onlineUsers[obj.uid]};

            // 删掉这个用户，在线人数-1
            delete onlineUsers[obj.uid];
            onlineCount--;

            // 向客户端发送用户登出事件，同时发送在线用户、在线人数及登出用户
            io.emit('logout', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj});
            console.log(obj.username+'退出了群聊');
        }
    });


    // 监听客户端断开连接
    socket.on('disconnect', function() {

        // 若存在这个用户
        if (onlineUsers.hasOwnProperty(socket.id)) {
            let obj = {uid: socket.id, username: onlineUsers[socket.id]};

            // 删掉这个用户，在线人数-1
            delete onlineUsers[socket.id];
            onlineCount--;

            // 向客户端发送用户登出事件，同时发送在线用户、在线人数及登出用户
            io.emit('logout', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj});
            console.log(obj.username+'退出了群聊');
        }
    });

    // 监听客户端发送的消息
    socket.on('message', function(obj) {
        io.emit('message', obj);
        console.log(obj.username+'说'+obj.message);
    });

});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
