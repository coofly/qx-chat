function appendZero(obj) {
    if (obj < 10) return "0" + "" + obj;
    else return obj;
}

function getLocalHMS() {
    var time = (new Date()).getTime();
    var d = new Date();
    return appendZero(d.getHours()) + ":" + appendZero(d.getMinutes()) + ":" + appendZero(d.getSeconds());
}

function getStringLength(_str) {
    return _str.replace(/[^\u0000-\u00ff]/g, "tt").length;
}

function GetVisibilityKey() {
	var state;
	if (typeof document.hidden !== "undefined") {
		state = "visibilityState";
	} else if (typeof document.mozHidden !== "undefined") {
		state = "mozVisibilityState";
	} else if (typeof document.msHidden !== "undefined") {
		state = "msVisibilityState";
	} else if (typeof document.webkitHidden !== "undefined") {
		state = "webkitVisibilityState";
	}
	return state;
}