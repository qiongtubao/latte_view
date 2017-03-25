/**
	<img latte-src="i"></img>
	一般绑定的是src
	单项
	音频有问题
*/
var LatteObject = require("latte_lib").object
	, latte_lib = require("latte_lib")
	, lib = require("../../lib/index.js");
var Command = {};
(function() {
	this.after = function(data, view, controller) {
		var stringContent = view.latte("src");
		var latteObject = LatteObject.create(data);
		if(stringContent) {
			var keys = lib.stringRegExp(stringContent);
			view.attr("src",  latte_lib.format.templateStringFormat(stringContent, data.toJSON()) );
			keys.forEach(function(key) {
				controller.bind("data", key, function() {
					view.attr("src",  latte_lib.format.templateStringFormat(stringContent, data.toJSON()) );
				});
			});
		}

	};
}).call(Command);

module.exports = Command;