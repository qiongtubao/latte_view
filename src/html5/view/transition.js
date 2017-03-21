var latte_transitionPrototype = []
	, View = require("./view.js")
	, latte_lib = require("latte_lib")
	, Ease = require("./ease.js");
var Utils = require("./viewUtils.js");
var Transition = function(dom) {
	this.dom = dom;
};
(function() {
	this.node = function() {
		return this.dom;
	}
	this.getData = function() {
		return Utils.getData(this.node());
	}

		var latte_interpolateTransform = function(a, b) {
			var s = [], q = [];
			a = latte.transform(a), b = latte.transform(b);
			latte_interpolateTranslate(a.translate, b.translate, s, q);
			latte_interpolateRotate(a.rotate, b.rotate, s, q);
			latte_interpolateSkew(a.skew, b.skew, s, q);
			latte_interpolateScale(a.scale, b.scale, s, q);
			a = b = null;
			return function(t) {
				var i = -1, n = q.length, o;
				while(++i < n) {
					s[(o=q[i]).i] = o.x(t);
				}
				return s.join("");
			};
		}
		var latte_interpolate = Utils.interpolate;
			var latte_transition_tween = function(groups, name, value, tween) {
				var id = groups.id, ns = groups.namespace;
				var doFunc ;
				if(latte_lib.isFunction(value)) {
					doFunc = function(node, i, j) {
				      	//node[ns][id].tween.set(name, tween(value.call(node, node.__data__, i, j)));
				      	node[ns][id].tween.set(name, tween(value.call(node, Utils.getData(node), i, j)));
				    };
				}else{
					var value = tween(value);
					doFunc = function(node) {
				      	//node[ns][id].tween.set(name, value);
				      	node[ns][id].tween.set(name, value);
				    };
				}
			    return doFunc.call(groups.node(), groups.node(), groups.getData());
			}
			var latte_interpolate = Utils.latte_interpolate;
	this.attr = function(nameNs, value) {
		if(arguments.length < 2) {
			for(value in nameNs) {
				this.attr(value, nameNs[value]);
			}
			return this;
		}
		var interpolate = nameNs == "transform" ? 
			latte_interpolateTransform: latte_interpolate
			, name = Utils.ns.qualify(nameNs);	
		function attrNull() {
			this.removeAttribute(name);
		}
		function attrNullNS() {
			this.removeAttributeNS(name.space, name.local);
		}
		function attrTween(b) {
			return b == null ? attrNull: (b += "", function() {
				var a = this.getAttribute(name), i;
				return a !== b && (i = interpolate(a, b), function(t) {
					//console.log(i, t, i(t));
					this.setAttribute(name, i(t));
				});
			});
		}
		function attrTweenNS(b) {
			return b == null? attrNullNS: (b += "", function() {
				var a = this.getAttributeNS(name.space, name.local), i;
				return a !== b && (i = interpolate(a, b), function(t) {
					this.setAttributeNS(name.space, name.local, i(t));
				});
			})
		}
		latte_transition_tween(this, "attr." + nameNs, value, name.local? attrTweenNS: attrTween);
		return this;
	}
	this.style = function(name, value, priority) {
		var n = arguments.length;
	    if (n < 3) {
	      if (typeof name !== "string") {
	        if (n < 2) value = "";
	        for (priority in name) this.style(priority, name[priority], value);
	        return this;
	      }
	      priority = "";
	    }
	    function styleNull() {
	      this.style.removeProperty(name);
	    }
	    function styleString(b) {
	      return b == null ? styleNull : (b += "", function() {
	        var a = Utils.window(this).getComputedStyle(this, null).getPropertyValue(name), i;
	        return a !== b && (i = latte_interpolate(a, b), function(t) {
	          this.style.setProperty(name, i(t), priority);
	        });
	      });
	    }
	    return latte_transition_tween(this, "style." + name, value, styleString);
	}

	/**
		设置执行时间
	*/
	this.duration = function(value) {
		var id = this.id
			, ns = this.namespace;
		if(arguments.length < 1) return this.node()[ns][id].duration;
		var doFunc;
		if(latte_lib.isFunction(value)) {
			doFunc = function(node, i, j) {
				 node[ns][id].duration = Math.max(1, value.call(node, Utils.getData(node), i, j));
			}
		}else{
			value = Math.max(1, value);
			doFunc =  function(node) {
				node[ns][id].duration = value;
			}
		}
		doFunc.call(this, this.node(), 0, 0);
		return this; 
	}
	/**
		动画缓动
	*/
	this.ease = function(value) {
		var id = this.id, ns = this.namespace;
		if(arguments.length < 1) {
			return this.node()[ns][id].ease;
		}
		if(typeof value !== "function") {
			value = Ease.get(Ease, arguments);	
		}
		(function(node) {
			node[ns][id].ease = value;
		}).call(this, this.node());
		 return this;
	}
	/**
		延迟时间
	*/
	this.delay = function(value) {
		var id = this.id , ns = this.namespace;
		if(arguments.length < 1) return this.node()[ns][id].delay;
		var doFunc;
		if(latte_lib.isFunction(value)) {
			doFunc = function(node, i, j) {
				node[ns][id].delay = Math.max(1, value.call(node, Utils.getData(node), i, j));
			}
		}else{
			value = +value;
			doFunc = function(node) {
				node[ns][id].delay = value;
			}
		}
		doFunc.call(this, this.node(), 0, 0);
		return this;
	}
	
	/**
		@method
		设置时间
		type
	*/
	this.on = function(type, listener) {
		var id = this.id, ns = this.namespace;
		if(arguments.length < 2) {
			var inherit = Transition.latte_transitionInherit
				, inheritId = Transition.latte_transitionInheritId;
		}else{
			(function(node) {
				var Events = latte_lib.events;
	        	var transition = node[ns][id];
	        	(transition.event || (transition.event = new Events())).on(type, listener);
	      	}).call(this, this.node(), 0,0);
		}
		return this;
	}

	this.call = function(callback) {
		var args = Utils.array(arguments);
		callback.apply(args[0] = this, args);
		return this;
	}
}).call(Transition.prototype);
(function() {
	var self = this;
	this.latte_transitionId = 0;
	this.latte_transitionInheritId = null;
	this.latte_transitionNamespace = function(name) {
		return name == null ? "__transition__" : "__transition_" + name + "__";
	}
	var latte_timer = require("./utils/timer.js").timer;
	var Map = require("./utils/map.js");
	this.latte_transitionNode = function(node, i, ns, id, inherit) {
		var lock = node[ns] || (node[ns] = {
	      	active: 0,
	      	count: 0
	    }), transition = lock[id], time, timer, duration, ease, tweens;
	    function schedule(elapsed) {
		      var delay = transition.delay;
		      timer.t = delay + time;
		      if (delay <= elapsed) return start(elapsed - delay);
		      timer.c = start;
		    }
		    function start(elapsed) {
		      var activeId = lock.active, active = lock[activeId];
		      	if (active) {
			        active.timer.c = null;
			        active.timer.t = NaN;
			        --lock.count;
			        delete lock[activeId];
			        //active.event && active.event.interrupt.call(node, Utils.getData(node), active.index);
			      	active.event && active.event.emit("interrupt", Utils.getData(node), active.index);
		      	}
		      for (var cancelId in lock) {
		        if (+cancelId < id) {
		          var cancel = lock[cancelId];
		          cancel.timer.c = null;
		          cancel.timer.t = NaN;
		          --lock.count;
		          delete lock[cancelId];
		        }
		      }
		      timer.c = tick;
		      latte_timer(function() {
		        if (timer.c && tick(elapsed || 1)) {
		          timer.c = null;
		          timer.t = NaN;
		        }
		        return 1;
		      }, 0, time);
		      lock.active = id;
		      //transition.event && transition.event.start.call(node,  Utils.getData(node), i);
		      transition.event && transition.event.emit( "start", Utils.getData(node), i);
		      tweens = [];
		      transition.tween.forEach(function(key, value) {
		        if (value = value.call(node,  Utils.getData(node), i)) {
		          tweens.push(value);
		        }
		      });
		      ease = transition.ease;
		      duration = transition.duration;
		    }
		    function tick(elapsed) {
		      var t = elapsed / duration, e = ease(t), n = tweens.length;
		      while (n > 0) {
		        tweens[--n].call(node, e);
		      }
		      if (t >= 1) {
		        //transition.event && transition.event.end.call(node, Utils.getData(node), i);
		        transition.event && transition.event.emit("end", Utils.getData(node),i);
		        if (--lock.count) delete lock[id]; else delete node[ns];
		        return 1;
		      }
		    }
		    if (!transition) {
		      time = inherit.time;
		      timer = latte_timer(schedule, 0, time);
		      transition = lock[id] = {
		        tween: Map.create(),
		        time: time,
		        timer: timer,
		        delay: inherit.delay,
		        duration: inherit.duration,
		        ease: inherit.ease,
		        index: i
		      };
		      inherit = null;
		      ++lock.count;
		    }
	}
	

	this.create = function(dom, name) {
		var id = self.latte_transitionInheritId || ++self.latte_transitionId,
		ns = self.latte_transitionNamespace(name), 
		subgroups = [], subgroup, node, 
		transition = latte.latte_transitionInherit || {
				time: Date.now(),
		      	ease: Ease.latte_ease_cubicInOut,
		      	delay: 0,
		      	duration: 250
    	};
    	self.latte_transitionNode(dom, 0, ns, id, transition);
		var transition = new Transition(dom);
		transition.id = id;
		transition.namespace = ns;
		return transition;
	}
}).call(Transition);
module.exports = Transition;