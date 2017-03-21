(function() {
	var self = this;
	this.latte_ease_cubicInOut = function(t) {
		if(t <= 0) return 0;
		if(t >= 1) return 1;
		var t2 = t * t, t3 = t2 * t;
		return 4 * (t < .5 ? t3: 3* (t - t2) + t3 - .75);
	}
	this.get = function() {
		return self.latte_ease_cubicInOut;
	}
}).call(module.exports);