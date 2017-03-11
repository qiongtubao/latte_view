(function() {
	var Loader = require("../../loader");
	this.draw = function(ctx, local, object) {
		/**
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
		*/
		var animation = Loader.loadAnimation(object.attribute.src);
		if(!animation) {
			return {
				width: 0,
				height: 0
			}
		}
		var image = loader.loadImage(animation.meta.image, function(err, image) {
			if(err) { return err; }
			ctx.change(object);
		});
		
		if(image.width) {
			
			object.animationIndex = (++object.animationIndex)%animation.frames.length || 0;
			console.log(object.animationIndex)
			var data = animation.frames[object.animationIndex];
			
			var result = ctx.drawImage(local, {
				imageX: data.frame.x,
				imageY: data.frame.y,
				imageWidth: data.frame.w,
				imageHeight: data.frame.h,
				width: data.frame.w,
				height: data.frame.h,
				opacity: object.style.opacity || 1
			}, image);
			result.once = 1;
			return result;
			
			
		}else{
			return {
				width: 0,
				height: 0,
				once: 1
			}
		}
	}
}).call(module.exports);