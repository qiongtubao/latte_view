(function() {
	var latte_lib = require("latte_lib");
	var defaultStyle = {
		backgroundColor: "#ffffff",
		borderColor: "#ffffff",
		borderWidth: 1
	}
	this.draw = function(ctx, local, object)  {
		var attr = ctx.drawBox({
			x: 0,
			y: 0
		}, object.style.mergerDefault(defaultStyle));
		return {
			x: 0,
			y: 0,
			width: object.style.width,
			height: object.style.height
		};
	}

}).call(module.exports);