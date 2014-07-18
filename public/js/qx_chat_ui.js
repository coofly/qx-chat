//滚动聊天栏到最底部

var g_hide = false;

function chatBodyToBottom() {
    var chat_body = $('.chat-body');
    var height = chat_body.prop("scrollHeight");
    chat_body.prop('scrollTop', height);
}

function addMessage(_name, _time, _content) {
    var msg_list = $(".msg-list-body");
	_content = QxEmotion.Parse(_content);
    msg_list.append(
            '<div class="clearfix msg-wrap"><div class="msg-head">' +
            '<span class="msg-name label label-primary pull-left">' +
            '<span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;' + _name + '</span>' +
            '<span class="msg-time label label-default pull-left">' +
            '<span class="glyphicon glyphicon-time"></span>&nbsp;&nbsp;' + _time + '</span>' +
            '</div><div class="msg-content">' + _content + '</div></div>'
    );
    chatBodyToBottom();
}

function addServerMessage(_time, _content) {
    var msg_list = $(".msg-list-body");
	_content = QxEmotion.Parse(_content);
    msg_list.append(
            '<div class="clearfix msg-wrap"><div class="msg-head">' +
            '<span class="msg-name label label-danger pull-left">' +
            '<span class="glyphicon glyphicon-info-sign"></span>&nbsp;&nbsp;系统消息</span>' +
            '<span class="msg-time label label-default pull-left">' +
            '<span class="glyphicon glyphicon-time"></span>&nbsp;&nbsp;' + _time + '</span>' +
            '</div><div class="msg-content">' + _content + '</div></div>'
    );
    chatBodyToBottom();
}

function removeListUser(_user) {
    $(".list-table tr").each(function () {
        if (_user == $(this).find('td').text()) {
            $(this).remove();
        }
    });
}

function addUserToList(_user) {
    $(".list-table").append('<tr><td>' + _user + '</td></tr>');
}

function useUserList(_user_list) {
    $(".list-table").html("");
    for (var i = 0; i < _user_list.length; i++) {
        addUserToList(_user_list[i]);
    }
    updateListCount();
}

function updateListCount() {
    var list_count = $('.list-table').find('tr').length + 1;
    $('#list-count').text("当前在线：" + list_count + "人");
}

//各种元素响应---------------------------------------------------------
function onClickSendMessage() {
    if ('' == $.cookie('chat_nickname') || null == $.cookie('chat_nickname')) {
        return $('#login-modal').modal('show');
    }
    var edit = $("#input-edit");
    var content = edit.val();
    if ("" == content) {
        return;
    }
    say(content);
    edit.val("");
}

function onClickApplyNickname() {
	var nickname_edit = $('#nickname-edit');
	var nickname_error = $("#nickname-error");
    var name = nickname_edit.val();
    if ("" == name) {
	    nickname_error.text("请填写昵称。");
	    nickname_error.show();
	    nickname_edit.focus();
        return;
    }
    var name_len = getStringLength(name);
    if (name_len < 4 || name_len > 16) {
	    nickname_error.text("请填写正确的昵称，应为4到16个字符。");
	    nickname_error.show();
        return;
    }
    if (name == $.cookie('chat_nickname')) {
	    nickname_error.text("你本来就叫这个。");
	    nickname_error.show();
    }
    changeNickname(name);
    Notify.request();
}

function onClickChangeNickname() {
    $('#login-modal').modal('show');
}

//各种事件响应----------------------------------------------------------
$("div[role='dialog']").on("show.bs.modal", function () {
    // 具体css样式调整
    $(this).css({
        "display": "block",
        "margin-top": function () {
            return ($(this).height() / 3);
        }
    });
});

$("#login-modal").on("show.bs.modal", function (_event) {
    $('#nickname-edit').val("");
    $("#nickname-error").hide();
});

$("#login-modal").on("shown.bs.modal", function (_event) {
    $('#nickname-edit').focus();
});

$('#input-edit').keydown(function(_event) {
   if(13 == _event.keyCode) {
       onClickSendMessage();
   }
});

$('#nickname-edit').keydown(function(_event) {
    if(13 == _event.keyCode) {
        onClickApplyNickname();
    }
});

QxEmotion($('#emotion-btn'), $('#input-edit'));