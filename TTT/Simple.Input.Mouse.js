/// <reference path="Simple.js" />
if (window.Simple === undefined) { Simple = {}; }
/// <reference path="Simple.Input.js" />
if (window.Simple.Input === undefined) { Simple.Input = {}; }

Simple.Input.Mouse = {}
Simple.Input.Mouse.Setup = function (domElement, handler) {
	if (
		(handler === undefined) ||
		(handler === null)
	) {
		handler = new Simple.Input.Mouse.Handler();
		handler.Offsets.Size.X = domElement.width;
		handler.Offsets.Size.Y = domElement.height;
	}

	domElement.onmousemove = function (e) {
		var mousePos = { X: 0, Y: 0 }
		if (e.offsetX !== undefined) {
			mousePos.X = e.offsetX;
			mousePos.Y = e.offsetY;
		}
		else if (e.layerX !== undefined) {
			mousePos.X = e.layerX;
			mousePos.Y = e.layerY;
		}

		handler.Change(mousePos, null, null, null);
	}
	domElement.onmousedown = function (e) { handler.Change(null, true, null, null); }
	domElement.onmouseup = function (e) { handler.Change(null, false, null, null); }
	domElement.onmouseover = function (e) { handler.Change(null, null, true, null); }
	domElement.onmouseout = function (e) { handler.Change(null, false, false, null); }
	document.onmousewheel = function (e) {
		var change = 0;

		if (e.wheelDelta) { change = -e.wheelDelta / 120; }
		else if (e.detail) { change = e.detail / 3; }

		handler.Change(null, false, false, change);
	}
	if (window.addEventListener) {
		document.addEventListener("DOMMouseScroll", document.onmousewheel, false);
	}


	return handler;
}

Simple.Input.Mouse.Handler = function () {
	this.Offsets = {
		Use: false,
		Position: { X: 0, Y: 0 },
		Size: { X: 1, Y: 1 }
	}

	this.Position = { X: 0, Y: 0 }

	this.Changed = { Position: false, Down: false, Active: false, Scroll:false }

	this.Change = function () {
		return Simple.Input.Mouse.Handler.prototype.Change.apply(this, arguments);
	}

	this.Change.Captures = new Array();
	this.Change.Captures.Add = function () {
		return Simple.Input.Mouse.Handler.prototype.Change.Captures.Add.apply(this, arguments); 
	}
}

Simple.Input.Mouse.Handler.prototype.Offsets = {
	Use: false,
	Position: { X: 0, Y: 0 },
	Size: { X: 1, Y: 1 }
}

Simple.Input.Mouse.Handler.prototype.Position = { X: 0, Y: 0 }
Simple.Input.Mouse.Handler.prototype.Down = false;
Simple.Input.Mouse.Handler.prototype.Active = false;
Simple.Input.Mouse.Handler.prototype.Scroll = 0;
Simple.Input.Mouse.Handler.prototype.Changed = { Position: false, Down: false, Active: false }

Simple.Input.Mouse.Handler.prototype.Change = function (position, down, active, scroll) {
	this.Changed.Position = ((position !== undefined) && (position !== null));
	if (this.Changed.Position) {
		this.Position = position;

		if (this.Offsets.Use) {
			this.Position.X = ((this.Position.X - Canvas.Screen.Position.X) / Screen.Size.X) * Screen.OriginalSize.X;
			this.Position.Y = ((this.Position.Y - Canvas.Screen.Position.Y) / Screen.Size.Y) * Screen.OriginalSize.Y;

			if (active !== false) {
				if (
					(this.Position.X < 0) ||
					(this.Position.X > Screen.OriginalSize.X) ||
					(this.Position.Y < 0) ||
					(this.Position.Y > Screen.OriginalSize.Y)
				) {
					active = false;
				}
				else {
					active = true;
				}
			}
		}

	}

	this.Changed.Down = ((down !== undefined) && (down !== null));
	if (this.Changed.Down) { this.Down = down; }

	this.Changed.Active = ((active !== undefined) && (active !== null));
	if (this.Changed.Active) { this.Active = active; }

	this.Changed.Scroll = ((scroll !== undefined) && (scroll !== null));
	if (this.Changed.Scroll) { this.Scroll = scroll; }

	for (var c = 0; c < this.Change.Captures.length; c++) {
		this.Change.Captures[c]();
	}
}

Simple.Input.Mouse.Handler.prototype.Change.Captures = new Array();
Simple.Input.Mouse.Handler.prototype.Change.Captures.Add = function (capture) { this.push(capture); }

Simple.Input.Mouse.Handler.prototype.toString = function () {
	return "{ X:" + this.Position.X.toFixed(2) + ", Y: " + this.Position.Y.toFixed(2) + ", Down: " + this.Down.toString() + ", Active: " + this.Active.toString() + ", Scroll: " + this.Scroll + " }";
}
