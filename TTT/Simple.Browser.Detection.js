/// <reference path="Simple.js" />
if (window.Simple === undefined) { window.Simple = {}; }

Simple.Browser = {
	Detection: {
		Extension: null,
		Detect: function () {
			if (this.Detect.Detected == true) { return; }

			// Must be called after the body has been instantiated
			//	(called from inside the body tag)
			if (document.body != null) {
				this.CSS.Transform.Has3D = false;

				if (document.body.style.WebkitTransform != null) {
					this.Extension = "Webkit";
					this.CSS.Transform.Has3D = true;
				}
				else if (document.body.style.MozTransform != null) { this.Extension = "Moz"; }
				else if (document.body.style.OTransform != null) { this.Extension = "O"; }

				this.Detect.Detected = true;
			}
		},
		CSS: {
			_: null,
			Transform: function (element, transform) {
				return this.SetExtended(element, "Transform", transform);
			},
			SetExtended: function (element, styleName, styleText) {
				element.style[this._.Extension + styleName] = styleText;
				return element;
			}
		},
		IsMobileSafari: function () {
			if (Simple.Browser.Detection.IsMobileSafari.Result == null) {
				Simple.Browser.Detection.IsMobileSafari.Result = ((navigator.userAgent.indexOf("iPod") != -1) || (navigator.userAgent.indexOf("iPhone") != -1));
			}

			return Simple.Browser.Detection.IsMobileSafari.Result;
		}
	}
}

Simple.Browser.Detection.CSS._ = Simple.Browser.Detection;
Simple.Browser.Detection.Detect.Detected = false;
Simple.Browser.Detection.CSS.Transform.Has3D = null;
Simple.Browser.Detection.IsMobileSafari.Result = null;
