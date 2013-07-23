/// <reference path="Simple.js" />
if (window.Simple === undefined) { Simple = {}; }

Simple.Viewport = {}

Simple.Viewport.Size = {
	Get: function () {
		return { X: window.innerWidth, Y: window.innerHeight }
	},
	Set: function (x, y) {
		return window.resizeTo(x, y);
	},
	ChangeBy: function (x, y) {
		return window.resizeBy(x, y);
	}
}
