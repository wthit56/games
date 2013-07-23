/// <reference path="Simple.js" />
if (window.Simple === undefined) { Simple = {}; }

// .Math
Simple.Math = {}

// .Math.Angle
Simple.Math.Angle = {}

Simple.Math.Angle.DegreesToRadians = function (degrees) {
	return this.DegreesToRadians.Ratio * degrees;
}
Simple.Math.Angle.DegreesToRadians.Ratio = (Math.PI / 180);

Simple.Math.Angle.RadiansToDegrees = function (radians) {
	return this.RadiansToDegrees.Ratio * radians;
}
Simple.Math.Angle.RadiansToDegrees.Ratio = (180 / Math.PI);

Simple.Math.Angle.FromPosition = function (x, y) {
	var a = Simple.Math.Angle.RadiansToDegrees(Math.atan2(x, -y));
	if (a < 0) { a += 360; }
	return a;
}
Simple.Math.Angle.ToPosition = function (angle) {
	angle = Simple.Math.Angle.DegreesToRadians(angle);
	return { X: Math.sin(angle), Y: -Math.cos(angle) }
}

Simple.Math.Angle.Difference = function (a, b, polarized) {
	if (polarized === undefined) { polarized = true; }

	var diff1 = a - b;
	var diff1diff = Simple.Math.Number.Difference(0, diff1);

	var diff2 = (a - 360) - b;
	var diff2diff = Simple.Math.Number.Difference(0, diff2);

	var diff3 = a - (b - 360);
	var diff3diff = Simple.Math.Number.Difference(0, diff3);

	var returned = diff1;
	var returneddiff = diff1diff;

	if (diff2diff < returneddiff) { returned = diff2; returneddiff = diff2diff; }
	if (diff3diff < returneddiff) { returned = diff3; returneddiff = diff3diff; }

	if (polarized) { return returned; }
	else { return returneddiff; }
}

// .Math.Area
Simple.Math.Area = {}

Simple.Math.Area.ExpandBy = function (aLeft, aTop, aWidth, aHeight, expandBy) {
	aLeft -= expandBy;
	aTop -= expandBy;
	aWidth += expandBy * 2;
	aHeight += expandBy * 2;

	return { Left: aLeft, Top: aTop, Width: aWidth, Height: aHeight }
}

Simple.Math.Area.Center = function (aWidth, aHeight) {
	return { X: aWidth / 2, Y: aHeight / 2 }
}
Simple.Math.Area.CenterInArea = function (aWidth, aHeight, bLeft, bTop, bWidth, bHeight) {
	var aCenter = Simple.Math.Area.Center(aWidth, aHeight);

	var bCenter = Simple.Math.Area.Center(bWidth, bHeight);
	bCenter.X += bLeft;
	bCenter.Y += bTop;

	return { X: bCenter.X - aCenter.X, Y: bCenter.Y - aCenter.Y }
}

Simple.Math.Area.Fit = function (fit, into, scaleDown, debug) {
	if (debug == true) {

		if (
			(typeof (fit) != "object") ||
			(!fit.hasOwnProperty("X")) ||
			(!fit.hasOwnProperty("Y"))) {
			throw new Error("Paremeter 'fit' must be an object in the form { X: number, Y: number }.");
		}

		if (
			(typeof (into) != "object") ||
			(!into.hasOwnProperty("X")) ||
			(!into.hasOwnProperty("Y"))) {
			throw new Error("Paremeter 'into' must be an object in the form { X: number, Y: number }.");
		}

	}

	var fitRatio = fit.X / fit.Y;
	var intoRatio = into.X / into.Y;

	var scale = 1;
	if (intoRatio > fitRatio) {
		// by height
		scale = into.Y / fit.Y;
	}
	else {
		// by width
		scale = into.X / fit.X;
	}

	if ((scale===false) && (scale < 1)) {
		// stop scaling down
		scale = 1;
	}

	return scale;
}

/*
Simple.Math.Area.Fit = function (sX, sY, fX, fY, scaleUp, scaleDown) {
	var original = { X: sX, Y: sY }

	if (
		(scaleUp === undefined) ||
		(scaleUp === null)
	) {
		scaleUp = true;
	}
	if (
		(scaleDown === undefined) ||
		(scaleDown === null)
	) {
		scaleDown = true;
	}

	var n = { X: null, Y: null }

	if (fX == undefined) { fX = null; }
	if (fY == undefined) { fY = null; }

	if (
		(fX == null) &&
		(fY == null)
	) {
		return original;
	}

	var useX = (fX != null);
	var resolved = false;

	var i = 0;
	while (resolved == false) {
		if (useX) {
			n.X = fX;
			n.Y = sY * (fX / sX);
			if ((fY != null) && (n.Y > fY)) {
				useX = false;
				continue;
			}
		}
		else {
			n.Y = fY;
			n.X = sX * (fY / sY);

			if ((fX != null) && (n.X > fX)) {
				useX = false;
				continue;
			}
		}

		resolved = true;
	}

	if (
		(
			(!scaleUp) &&
			(
				(n.X > sX) ||
				(n.Y > sY)
			)
		) ||
		(
			(!scaleDown) &&
			(
				(n.X < sX) ||
				(n.Y < sY)
			)
		)
	) {
		return original;
	}

	return n;
}
Simple.Math.Area.FitUsingScale = function (sX, sY, fX, fY, scaleUp, scaleDown) {
	var fitted = Simple.Math.Area.Fit(sX, sY, fX, fY, scaleUp, scaleDown);
	return fitted.X / sX;
}
*/

// .Math.Number
Simple.Math.Number = {}

Simple.Math.Number.Difference = function (a, b) {
	var diff = b - a;
	if (diff < 0) { diff = a - b; }
	return diff;
}
Simple.Math.Number.Tween = function (a, b, amount) {
	return a + ((b - a) * amount);
}
Simple.Math.Number.Cap = function (n, lowerCap, upperCap) {
	if ((lowerCap !== null) && (lowerCap !== undefined)) {
		if (n < lowerCap) { return lowerCap; }
	}
	if ((upperCap !== null) && (upperCap !== undefined)) {
		if (n > upperCap) { return upperCap; }
	}
	return n;
}

// .Math.Point
Simple.Math.Point = function () {
	switch (arguments.length) {
		case 1:
			this.X = arguments[0];
			this.Y = arguments[0];
			break;
		case 2:
			this.X = arguments[0];
			this.Y = arguments[1];
			break;
	}
}
Simple.Math.Point.prototype.X = 0;
Simple.Math.Point.prototype.Y = 0;
