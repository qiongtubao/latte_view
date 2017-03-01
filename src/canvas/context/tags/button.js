(function() {
	this.draw = function(ctx, local, object) {
		var result =ctx.drawBox(local, object.style);
		ctx._drawMiddleText(local, object.style, object.text);
		return result;
	}

}).call(module.exports);