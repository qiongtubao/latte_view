(function() {
	var latte_lib = require("latte_lib");
	var defaultStyle = {
		width: 130,
		height: 50,
		fontSize: 16,
		backgroundColor: "#00aa00"

	};
	this.draw = function(ctx, local, object) {
		var style = object.style.mergerDefault(defaultStyle);
		var result =ctx.drawBox(local, style);
		ctx.drawTextMiddle(local, style, object.text || "按钮");
		return result;
	}

}).call(module.exports);