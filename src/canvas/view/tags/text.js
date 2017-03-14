(function() {
	var defaultStyle = {
		fontSize: 12
	};
	var latte_lib = require("latte_lib");
	this.draw = function(ctx, local, object) {
		var style =  object.style.mergerDefault(defaultStyle)
		return ctx.drawAuto(local, style, object.text || "");
	}
}).call(module.exports);