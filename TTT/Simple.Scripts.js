/// <reference path="Simple.js" />
if (window.Simple === undefined) { Simple = {}; }

Simple.Scripts = {}

Simple.Scripts.GetScriptNode = function () {
	var uid;
	while ((document.getElementById(uid) != null) || (uid == undefined)) {
		uid = "id_" + Math.random().toString().substring(2);
	}

	document.write("<span id=\"" + uid + "\"></span>");
	var ref = document.getElementById(uid);

	var next;
	var i = 0;
	while ((next !== null) || (next !== undefined)) {
		next = ref.previousSibling;
		if (next.tagName.toUpperCase() == "SCRIPT") { break; }
		i++;
		if (i > 1000) { throw new Error("too many recursions (1000)."); }
	}

	ref.parentNode.removeChild(ref);

	return next;
}
