(function() {
	var latte_lib = require("latte_lib");
	var defaultStyle = {
		backgroudColor: "#aa0000",
		borderColor: "#aa0000",
		borderWidth: 1
	}
	this.draw = function(ctx, local, object)  {
		var attr = ctx.drawBox({
			x: 0,
			y: 0
		}, latte_lib.merger(defaultStyle, object.style));
		object.childrens.forEach(function(c) {
			ctx.draw(c)
		});
		return attr;
	}
	
}).call(module.exports);