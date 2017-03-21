(function() {
		var latte_timer_queueHead
		, latte_timer_queueTail
		, latte_timer_interval
		, latte_timer_timeout
		, latte_vendorSymbol = require("./index.js").latte_vendorSymbol
		, latte_timer_frame = window[latte_vendorSymbol(window, "requestAnimationFrame")] || function(callback) {
			setTimeout(callback, 1000/60 );
		};
		function latte_timer_mark() {
			var now = Date.now() , timer = latte_timer_queueHead;
			while(timer) {
				if(now >= timer.t && timer.c(now - timer.t)) {
					timer.c = null;
				}
				timer = timer.n;
			}
			return now;
		};
	 	function latte_timer_sweep() {
			var t0, t1 = latte_timer_queueHead, time = Infinity;
			while(t1) {
				if(t1.c) {
					if(t1.t < time) time = t1.t;
					t1 = (t0 = t1).n;
				}else{
					t1 = t0? t0.n = t1.n: latte_timer_queueHead = t1.n;
				}
			}
			latte_timer_queueTail = t0;
			return time;
		};
		function latte_timer_step () {
			var now = latte_timer_mark(), delay = latte_timer_sweep() - now;
			if(delay > 24) {
				if(isFinite(delay)) {
					clearTimeout(latte_timer_timeout);
					latte_timer_timeout = setTimeout(latte_timer_step, delay);
				}
				latte_timer_interval = 0;
			}else{
				latte_timer_interval = 1;
				latte_timer_frame(latte_timer_step);
			}
		};
	var Timer = function(callback, delay, then) {
		var n = arguments.length;	
		if(n < 2) delay = 0;
		if(n < 3) then = Date.now();
		var time = then + delay, timer = {
			c: callback,
			t: time,
			n: null
		};
		if(latte_timer_queueTail) {
			latte_timer_queueTail.n = timer;
		}else{
			latte_timer_queueHead = timer;
		}
		latte_timer_queueTail = timer;
		if(!latte_timer_interval) {
			latte_timer_timeout = clearTimeout(latte_timer_timeout);
			latte_timer_interval = 1;
			latte_timer_frame(latte_timer_step);
		}
		return timer;
	};
	this.timer = function() {
		return Timer.apply(this, arguments);
	}
	this.timer.flush = function() {
		latte_timer_mark();
		latte_timer_sweep();
	}
}).call(module.exports);