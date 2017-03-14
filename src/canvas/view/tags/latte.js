(function() {
	var defaultStyle = {
		backgroundColor: "#ffffff",

		opacity: 1
	}
	this.draw = function(ctx, local, object) {
		
		var style = object.style.mergerDefault(defaultStyle);
		console.log(style);
		style.width = style.width || local.width;
		style.height = style.height || local.height;
		if(!style.width || !style.height) {
			return {};
		}
		console.log("draw latte",local, style);
		var result =ctx.drawBox(local, style);
		return result;
		
		//return {
		//	width: local.width,
		//	height: local.height
		//};
	}
}).call(module.exports);