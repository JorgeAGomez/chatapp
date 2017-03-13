var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var connections = [];
var users = [];
var color = 000000;
var nickname = "";
var current = "";

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

// listen to 'chat' messages
io.sockets.on('connection', function(socket){
    connections.push(socket);
    socket.current = socket.id;
    io.sockets.emit('new user', socket.id);
    users.push(socket.id);
    updateUsernames();
    console.log('Connected: %s socket connected: ', connections.length);



    //disconnect
    socket.on('disconnect', function(data){
      if(socket.customId === undefined){
        users.splice(users.indexOf(socket.id),1);
      }
      else {
        users.splice(users.indexOf(socket.customId),1);
      }
      connections.splice(connections.indexOf(socket),1);
      updateUsernames();
      console.log('Disconnected: %s sockets connected', connections.length);
    });

    //Send Message
    socket.on('send message', function(data){
      if(data.includes('/nick')){
        if(!data.includes('color')){
          var first = data.replace('/nick','');
          socket.customId = first.replace(' ','');
          socket.current = first.replace(' ','');
          io.sockets.emit('new user', socket.customId);
          var name = first.replace(' ','');
          var run = true;

          for(j = 0; j < users.length; j++){
            if(name === users[j]){
              run = false;
            }
          }

          if(run){
            for(i = 0; i < users.length; i++){
              if(socket.id === users[i]){
                users[i] = name;
              }
            }
          }
        }
        else{
          var getColor = data.split(' ');
          getColor = '#' + getColor[1];
          socket.color = getColor;
        }
        updateUsernames();
      }
      else {
        var currentTime = new Date();
        currentTime = currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds()
        //if(socket.customId != undefined){
          io.sockets.emit('new message',{msg: data, user: socket.current, time: currentTime, color: socket.color });
        //}
        // else{
        //   io.sockets.emit('new message',{msg: data, user: socket.current, time: currentTime, color: socket.color });
        // }

      }
    });

    function updateUsernames(){
      if(socket.customId != undefined){
        io.sockets.emit('get users', {users: users, currentUser: socket.customId});
      }
      else{

        io.sockets.emit('get users', {users: users, currentUser: socket.id});
      }

    }

});
