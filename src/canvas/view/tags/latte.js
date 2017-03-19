(function() {
	var defaultStyle = {
		backgroundColor: "#ffffff",

		opacity: 1
	}
	this.draw = function(ctx, local, object) {
		var style = object.style.mergerDefault(defaultStyle);
		console.log(local);
		style.width = local.width || style.width ;
		style.height = local.height || style.height  ;
		if(!style.width || !style.height) {
			return {};
		}
		console.log("draw latte",local, style, object);
		var result =ctx.drawBox(local, style);
		return result;
		
		//return {
		//	width: local.width,
		//	height: local.height
		//};
	}
}).call(module.exports);