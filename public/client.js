//shorthand for $(document).ready(...)


$(function(){
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat');
    var $messageArea = $('#messageArea');
    var $userForm = $('#userForm');
    var $userFormArea = $('#userFormArea');
    var $users = $('#users');
    var $username = $('#username');
    var $you = $('#you');



    socket.on('new user',function(data){

    });

    $messageForm.submit(function(e){
      e.preventDefault();
      socket.emit('send message', $message.val());
      $message.val('');
    });

    socket.on('new message', function(data){
      console.log(data.user);
      console.log(socket.id);


      if(data.user == socket.id){

        $('#chat').append('<li>'+ data.time + ' - ' + '<span style="color:'+data.color+';">' + data.user + '</span>' +': <strong>'+data.msg+'</strong> </li>');
      }
      // else if(data.user == usernew){
      //   console.log(data.user);
      //   console.log(usernew);
      //   $('#chat').append('<li>'+ data.time + ' - ' + '<span style="color:'+data.color+';">' + data.user + '</span>' +': <strong>'+data.msg+'</strong> </li>');
      // }
      else {
        $('#chat').append('<li>'+ data.time + ' - <span style="color:'+data.color+';">' + data.user +'</span>: '+data.msg+'</li>');
      }
      $('#chat').scrollTop($('#chat')[0].scrollHeight);
    });

    socket.on('get users',function(data){
      var html = '';
      var array = data.users;
      // console.log(socket.customId);
      for(i = 0; i < array.length; i++){
        html += '<li class="list-group-item">'+ array[i] + '</li>';
      }
      // socket.customId = data.currentUser;
      // console.log(socket.customId);
      $users.html(html);
    });
});
