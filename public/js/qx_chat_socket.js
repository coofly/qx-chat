/**
 * Created by coofly on 2014/7/12.
 */

var chat_server = 'http://' + location.hostname + ':3000';
console.log('server: ' + chat_server);
var socket = io.connect(chat_server);

socket.on('need_nickname', function () {
    if (null == $.cookie('chat_nickname')) {
        $('#login-modal').modal('show');
    } else {
        changeNickname($.cookie('chat_nickname'));
    }
});

socket.on('server_message', function (_message) {
    addServerMessage(getLocalHMS(), _message);
});

socket.on('change_nickname_error', function (_error_msg) {
    console.log('change_nickname_error : ' + _error_msg);
    $('#login-modal').modal('show');
    $("#nickname-error").text(_error_msg);
    $("#nickname-error").show();
    $('#nickname-edit').focus();
});

socket.on('change_nickname_done', function (_old_name, _new_nickname) {
    console.log('change_nickname_done(' + _new_nickname + ',' + _old_name + ')');
    $.cookie('chat_nickname', _new_nickname);
    $('#login-modal').modal('hide');
    $('#my-nickname').html('昵称：' + _new_nickname);

    if (_old_name != null && _old_name != "") {
        addServerMessage(getLocalHMS(), '[' + _old_name + '] 改名为 [' + _new_nickname + ']');
    }
    updateListCount();
});

socket.on('say_done', function (_nick_name, _content) {
    console.log('user_say(' + _nick_name + ', ' + _content + ')');
    addMessage(_nick_name, getLocalHMS(), _content);
});

socket.on('user_list', function (_list) {
    useUserList(_list);
});

socket.on('user_change_nickname', function (_old_nick_name, _new_nick_name) {
    console.log('user_change_nickname(' + _old_nick_name + ', ' + _new_nick_name + ')');
    removeListUser(_old_nick_name);
    addUserToList(_new_nick_name);
    addServerMessage(getLocalHMS(), '[' + _old_nick_name + '] 改名为 [' + _new_nick_name + ']');
});

socket.on('user_join', function (_nick_name) {
    console.log('user_join(' + _nick_name + ')');
    addUserToList(_nick_name);
    updateListCount();
    addServerMessage(getLocalHMS(), '[' + _nick_name + '] 进入了聊天室。');
});

socket.on('user_quit', function (_nick_name) {
    console.log('user_quit(' + _nick_name + ')');
    removeListUser(_nick_name);
    updateListCount();
    addServerMessage(getLocalHMS(), '[' + _nick_name + '] 离开了聊天室。');
});

socket.on('user_say', function (_nick_name, _content) {
    console.log('user_say(' + _nick_name + ', ' + _content + ')');
    addMessage(_nick_name, getLocalHMS(), _content);
    if ("hidden" == document[GetVisibilityKey()]) {
	    Notify.show({icon:'/img/qx_chat.png',
		    'title':'千寻聊天室',
		    'message':_nick_name + '：' + _content,
		    'autoclose':3,
            'onclick': function () {
                window.focus();
                if (undefined !== typeof this.colse){
                    this.close();
                } else if(undefined !== typeof this.cancel) {
                    this.cancel();
                }
            }});
    }
});

function changeNickname(_nickname) {
    socket.emit('change_nickname', _nickname);
}

function say(_content) {
    socket.emit('say', _content);
}