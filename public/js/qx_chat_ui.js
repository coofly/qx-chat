var g_nickname = "";

//滚动聊天栏到最底部
function chatBodyToBottom() {
    var height = $('.chat-body').prop("scrollHeight");
    $('.chat-body').prop('scrollTop', height);
}

function addMessage(_name, _time, _content) {
    var msg_list = $(".msg-list-body");
    msg_list.append(
        '<div class="clearfix msg-wrap"><div class="msg-head">' + 
        '<span class="msg-name label label-primary pull-left">' + 
        '<span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;' + _name + '</span>' + 
        '<span class="msg-time label label-default pull-left">' + 
        '<span class="glyphicon glyphicon-time"></span>&nbsp;&nbsp;' + _time + '</span>' + 
        '</div><div class="msg-content">'+ _content + '</div></div>'
        );
    chatBodyToBottom();
}

function addServerMessage(_time, _content) {
	var msg_list = $(".msg-list-body");
	msg_list.append(
			'<div class="clearfix msg-wrap"><div class="msg-head">' +
			'<span class="msg-name label label-danger pull-left">' +
			'<span class="glyphicon glyphicon-info-sign"></span>&nbsp;&nbsp;系统消息</span>' +
			'<span class="msg-time label label-default pull-left">' +
			'<span class="glyphicon glyphicon-time"></span>&nbsp;&nbsp;' + _time + '</span>' +
			'</div><div class="msg-content">'+ _content + '</div></div>'
	);
	chatBodyToBottom();
}

function removeListUser(_user) {
	$(".list-table tr").each(function(){
		if (_user == $(this).find('td').text()){
			$(this).remove();
		}
	});
}

function addUserToList(_user) {
	$(".list-table").append('<tr><td>' + _user + '</td></tr>');
}

function useUserList(_user_list) {
	$(".list-table").html("");
	for(var i = 0; i < _user_list.length; i++) {
		addUserToList(_user_list[i]);
	}
	updateListCount();
}

function updateListCount() {
	var list_count = $('.list-table').find('tr').length;
	console.log(list_count);
	if (g_nickname != '' && g_nickname != null){
		list_count = list_count + 1;
	}
	$('#list-count').text("当前在线：" + list_count + "人");
}

//各种元素响应---------------------------------------------------------
function onClickSendMessage () {
    //return;
	if ('' == g_nickname) {
		return $('#login-modal').modal('show');
	}
    var edit = $("#input-edit");
	if ("" == edit.val()) {
		return;
	}
	var content = xssEscape(edit.val());
	say(content);
    addMessage(g_nickname, getLocalHMS(), content);
    edit.val("");
}

function onClickApplyNickname () {
    if ("" == $('#nickname-edit').val()) {
	    $("#nickname-error").text("请填写昵称。");
        $("#nickname-error").show();
        $('#nickname-edit').focus();
        return;
    }
	changeNickname(xssEscape($('#nickname-edit').val()));
}

function onClickChangeNickname() {
	$('#login-modal').modal('show');
}


//各种事件响应----------------------------------------------------------
$("div[role='dialog']").on("show.bs.modal", function() {  
    // 具体css样式调整  
    $(this).css({  
        "display": "block",  
        "margin-top": function() {  
            return ($(this).height() / 3);  
        }  
    });  
});

$("#login-modal").on("show.bs.modal", function (e) {
    $('#nickname-edit').val("");
    $("#nickname-error").hide();
})

$("#login-modal").on("shown.bs.modal", function (e) {
    $('#nickname-edit').focus();
})

document.onkeydown = function() {
    if(event.keyCode == 13) {
        if ("input-edit" == document.activeElement.id) {
            onClickSendMessage();
        }
        else if ("nickname-edit" == document.activeElement.id) {
            onClickApplyNickname();
        };
    }
}

//调试代码--------------------------------------------------------------
function main () {
    $("#input-edit").focus();
    $('#login-modal').modal('show');
}

main();