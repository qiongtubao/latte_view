(function() {
	var loader = require("../../loader");
	this.draw = function(ctx, local, object) {
		var image = loader.loadImage(object.attribute.src, function(err, image) {
			if(err) { return err; }
			ctx.change(object);
		});
		
		if(image.width) {
			var result = ctx.drawImage(local, {
				imageX: 0,
				imageY: 0,
				imageWidth: image.width,
				imageHeight: image.height,
				width: image.width,
				height: image.height,
				opacity: object.style.opacity || 1
			}, image);
			return result;
		}else{
			return {
				width: 0,
				height: 0
			}
		}
		

	}
}).call(module.exports);