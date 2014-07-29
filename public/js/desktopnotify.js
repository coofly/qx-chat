/**************************************************
 * browser desktop notification api js lib
 * Author limodou@gmail.com
 * License MIT
 * version 0.1
 *
 * Inspired by https://github.com/gotardo/HTML5-Desktop-Notif
 **************************************************/
var Notify = {
	icon : null,
	title : null,
	message : null,
	autoclose : null,
	_type : '',

	isSupported : function () {
		var n;
		if (window.webkitNotifications)
		{
			n = window.webkitNotifications;
			this._type = 'webkit';
		}
		else if (window.Notification)
		{
			n = window.Notification;
			this._type = 'w3c';
		}
		return n;
	},

	log: function(){
		if (window.console && console.log){
			var args = Array.prototype.slice.call(arguments);
			console.log.apply(console, args);
		}
	},
	request: function(){
		var notify = this.isSupported();
		if (this.check() == 1)
			notify.requestPermission();
	},
	check: function(){
		var notify = this.isSupported();
		if (notify){
			if (this._type == 'webkit')
				return notify.checkPermission();
			else{
				var level;

				/* firefox is permission, it's not a function */
				if (notify.permission) level = notify.permission;
				else level = notify.permissionLevel();

				if (level == 'granted') return 0;
				else if (level == 'default') return 1;
				else return 3;
			}
		}
	},
	/* ------------------------------------------
	 Shows the notification (if possible)
	 message = {
	 icon:
	 title:
	 message:
	 onshow:
	 onclick:
	 onerror:
	 onclose:
	 }
	 ------------------------------------------ */

	show    : function (message) {
		var opts = {
			icon: message.icon || this.icon,
			title: message.title || this.title,
			message: message.message || this.message,
			autoclose: message.autoclose || this.autoclose,
			onshow: message.onshow || function(){},
			onclick: message.onclick || function(){},
			onerror: message.onerror || function(){},
			onclose: message.onclose || function(){}
		};
		var check, n;

		var notify = this.isSupported();
		//If webkitNotifications object is not available and we are in debug mode, an exception will be thrown...
		if (!notify) {
			return;
		}
		else {
			//Check for permission to show notifications. Request permission if notifications are not allowed
			this.request();
			check = this.check();

			if (check == 2) {
				this.log("Permission are denied!!");
			}
			//If permission is allowed, the notification is shown.
			if (check == 0) {
				if (this._type == 'webkit')
				{
					n = notify.createNotification(opts.icon, opts.title, opts.message);
					n.ondisplay = opts.onshow;
				}
				else {
					n = new notify(opts.title, {body:opts.message, icon:opts.icon});
					n.onshow = opts.onshow;
				}
				n.onclick = opts.onclick;
				n.onerror = opts.onerror;
				n.onclose = opts.onclose;

				if (this._type == 'webkit')
					n.show();

				if (opts.autoclose)
					setTimeout(function () {
                        //有的chrome浏览器下colse无效，貌似不统一
                        if (n.close){
                            n.close();
                        } else if(n.cancel) {
                            n.cancel();
                        }
					}, opts.autoclose * 1000);
			}
		}//End If

		return this;
	}

};