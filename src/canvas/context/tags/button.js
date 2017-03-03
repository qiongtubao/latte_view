(function() {
	var latte_lib = require("latte_lib");
	var defaultType = {
		width: 130,
		height: 50,
		fontSize: 16,
		backgroundColor: "#00aa00"

	};
	this.draw = function(ctx, local, object) {
		console.log("??????????????????");
		var style = latte_lib.merger(defaultType, object.style);
		var result =ctx.drawBox(local, style);
		//var result = style;
		ctx.drawTextMiddle(local, style, object.text || "按钮");
		return result;
	}

}).call(module.exports);