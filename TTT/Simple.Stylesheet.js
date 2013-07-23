/// <reference path="Simple.js" />
if (window.Simple === undefined) { window.Simple = {} }

Simple.Stylesheet = {}
Simple.Stylesheet.InsertEquivalents = function (equivalents, css, stylesheets, debug) {
	var prefix = null;
	var prefixTest = document.documentElement.style;
	if (prefixTest.MozAppearance !== undefined) { prefix = "moz"; }
	else if (prefixTest.WebkitAppearance !== undefined) { prefix = "webkit"; }
	else if (prefixTest.KhtmlAppearance !== undefined) { prefix = "khtml"; }
	else if (prefixTest.msTransform !== undefined) { prefix = "ms"; }
	else if (window.opera !== undefined) { prefix = "o"; }

	if (equivalents == null) {
		equivalents = new Array();
		for (var e in Simple.Stylesheet.InsertEquivalents.Equivalents) {
			equivalents.push(e);
		}
	}

	if (prefix == null) { return; }

	if (css != null) {
		var rules = css;
		var oldRules = css;

		var start = -1;
		var end = -1;

		for (var e = 0; e < equivalents.length; e++) {
			eq = equivalents[e];

			if (Simple.Stylesheet.InsertEquivalents.Equivalents[eq][prefix] !== true) { continue; }

			var i = 0;
			while (true) {
				start = rules.indexOf(eq + ":", end);
				if (start == -1) { start = rules.indexOf(eq + "(", end); }
				if (start == -1) { start = rules.indexOf(eq + " ", end); }
				if (start == -1) { break; }

				end = start + prefix.length + 2 + eq.length;
				if ((start > 0) && (rules.charAt(start - 1) == "-")) { start = -1; continue; }

				rules = rules.substring(0, start) + "-" + prefix + "-" + rules.substring(start);

				/*
				end = rules.indexOf(";", start);
				if (end == -1) { end = rules.indexOf("}"); }
				if (end == -1) { break; }

				value = rules.substring(start + (eq + ":").length, end);

				var add = " -" + prefix + "-" + eq + ":" + value + ";";
				rules = rules.substring(0, end + 1) + add + rules.substring(end + 1);

				end = end + 1 + add.length;
				*/

				if (Simple.Stylesheet.InsertEquivalents.Limit !== null) {
					i++;
					if (i == Simple.Stylesheet.InsertEquivalents.Limit) { throw new Error("Upper limit reached. Either an infinite loop has occured, in which case, you may need to fix the passed in 'equivalents' parameter. Or, you've got a huge stylesheet with more than the current limit (" + Simple.Stylesheet.FixExperimental.Limit + "), in which case you can set it using the 'Simple.Stylesheet.FixExperimental.Limit' property to a higher value, or 'null' to turn the limit off completely (not recommended)."); }
				}
			}

			start = -1;
			end = -1;
		}

		if (rules != oldRules) {
			rules = "" +
			"/* edited by Simple.Stylesheet.InsertEquivalents */" +
			"\n\n" + rules;
		}

		if (debug === true) { console.log(rules); }

		return rules;
	}
	else {
		if (stylesheets == null) {
			stylesheets = new Array();

			var tags = document.getElementsByTagName("STYLE");
			for (var i = 0; i < tags.length; i++) { stylesheets.push(tags[i]); }

			tags = document.getElementsByTagName("LINK");
			for (var i = 0; i < tags.length; i++) { stylesheets.push(tags[i]); }

			return Simple.Stylesheet.InsertEquivalents(equivalents, null, stylesheets, debug);
		}
		else {
			var tag;
			for (var t = 0; t < stylesheets.length; t++) {
				tag = stylesheets[t];

				if (tag.tagName == "LINK") {
					if ((tag.type != "text/css") || (tag.rel.toLowerCase() != "stylesheet")) { continue; }

					Simple.Http.Get(tag.href, null, function (response, status, http) {
						var rules = "" +
									"/* original css file: " + tag.href + " */" +
									"\n\n" +
									Simple.Stylesheet.InsertEquivalents(equivalents, response, null, debug);

						var styles = document.createElement("STYLE");
						styles.type = "text/css";
						styles.media = tag.media;
						styles.innerHTML = rules;

						tag.parentNode.insertBefore(styles, tag);
						tag.disabled = true;
					}
					);
				}
				else if (tag.tagName == "STYLE") {
					tag.innerHTML = Simple.Stylesheet.InsertEquivalents(equivalents, tag.innerHTML, null, debug);
				}
			}
		}
	}
}
Simple.Stylesheet.InsertEquivalents.Limit = 1000;

Simple.Stylesheet.InsertEquivalents.Tags = function (equivalents) {
	var tags = new Array();
	var temp;
	for (var i = 1; i < arguments.length; i++) {
		temp = document.getElementsByTagName(arguments[i]);
		for (var j = 0; j < temp.length; j++) {
			tags.push(temp[j]);
		}
	}

	return Simple.Stylesheet.InsertEquivalents(equivalents, null, tags);
}

Simple.Stylesheet.InsertEquivalents.Equivalents = {
	"box-shadow": { webkit: true },
	"border-radius": {},
	"border-top-left-radius": { webkit: true },
	"border-top-right-radius": { webkit: true },
	"border-bottom-right-radius": { webkit: true },
	"border-bottom-left-radius": { webkit: true },
	"border-image": { webkit: true },
	"box-sizing": { moz: true },
	"transition": { webkit: true, moz: true, o: true },
	"transition-delay": { webkit: true, moz: true, o: true },
	"transition-duration": { webkit: true, moz: true, o: true },
	"transition-property": { webkit: true, moz: true, o: true },
	"transition-time-function": { webkit: true, moz: true, o: true },
	"transform": { webkit: true, moz: true, o: true },
	"transform-origin": { webkit: true, moz: true, o: true },
	"user-select": { webkit: true, moz: true },
	"linear-gradient": { webkit: true, moz: true, o: true, ms: true },
	"gradient": { webkit: true, moz: true, o: true, ms: true },
	"keyframes": { webkit: true, moz: true },
	"animation": { webkit: true, moz: true },
	"animation-name": { webkit: true, moz: true },
	"animation-duration": { webkit: true, moz: true },
	"animation-delay": { webkit: true, moz: true },
	"animation-iteration-count": { webkit: true, moz: true }
}