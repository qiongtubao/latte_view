(function() {
	var defaultType = {
		backgroundColor: "#ffffff",

		opacity: 1
	}
	this.draw = function(ctx, local, object) {
		
		var style = latte_lib.merger(defaultType, object.style);
		style.width = style.width || local.width;
		style.height = style.height || local.height;
		if(!style.width || !style.height) {
			return {};
		}
		var result =ctx.drawBox(local, style);
		return result;
		
		//return {
		//	width: local.width,
		//	height: local.height
		//};
	}
}).call(module.exports);