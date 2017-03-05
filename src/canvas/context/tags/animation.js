(function() {
	var Loader = require("../../loader");
	this.draw = function(ctx, local, object) {
		var animation = Loader.loadAnimation(object.src);
		var image = loader.loadImage(animation.meta.image);
		var result = ctx.drawImage(local, {
			x: 0,
			y: 0,
		}, image);
		if(image.width) {
			object.drawNum++;
		}
		return {
			width: width,
			height: height,
			once: once,
			image: image
		};
	}
}).call(module.exports);