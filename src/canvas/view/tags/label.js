(function() {
	var defaultStyle = {
		fontSize: 12
	};
	var latte_lib = require("latte_lib");
	this.draw = function(ctx, local, object) {
		var style = object.style.mergerDefault(defaultStyle);
		var result = ctx.drawText(local, style, object.text || "hello");
		return result;
	}
}).call(module.exports);