var Utils = require("./viewUtils");
var View = function(dom) {
	this.dom = dom;
};
(function() {
	this.latte = function(name, value) {
		if(arguments.length < 2) {
			if(latte_lib.isString(name)) {
				return Utils.getAttr.call(this.node(), "latte-" + name);
			}
			for(value in name) {
				Utils.attr("latte-" + value, name[value]).call(this.node(), this.getData());
			}
			return this;
		}
		Utils.attr("latte-" + name, value).call(this.node(), this.getData());
		return this;
	}
	/**
		@method attr 
		@param name String or Object
		@param value String 
		@return   String or View
		@example
			var View = require("latte_dom").create;
			var view = View("css select");
			view.attr("width", 100);
	*/
	this.attr = function(name, value) {
		if(arguments.length < 2) {
			if(latte_lib.isString(name)) {
				return Utils.getAttr.call(this.node(), name);
			}
			for(value in name) {
				Utils.attr(value, name[value]).call(this.node(), this.getData());
			}
			return this;
		}
		Utils.attr(name, value).call(this.node(), this.getData());
		return this;
	}
	/**
		@method style 
		@param name String or Object
		@param value String 
		@param priority
		@return   Boolean or View
		@example
			var View = require("latte_dom").create;
			var view = View("css select");
			view.classed("latte_input", true);
	*/
	this.classed = function(name, value) {
		if(arguments.length < 2) {
			if(latte_lib.isString(name)) {
				var node = this.node(),
					n = (name = Utils.split_classes(name)).length,
					i = -1;
					if(vaue = node.classList) {
						while(++i < n) {
							if(!value.contains(name[i])) {
								return false;
							}
						}
					}else {
						value = Utils.getAttr("class").call(node, this.getData());
						while(++i < n) {
							if(!Utils.classedRe(name[i]).test(value)) {
								return false;
							}
						}
					}
					return true;
			}
			for(value in name) {
				Utils.classed(value, name[value].call(this.node(), this.getData()));
			}
			return this;
		}
		Utils.classed(name, value).call(this.node());
		return this;
	}
	
	this.style = function(name, value, priority) {
		var n = arguments.length;
		if(n < 3) {
			if(!latte_lib.isString(name)) {
				if( n < 2) value = "";
				for(priority in name) {
					Utils.style(priority, name[priority], value).call(this.node(), this.getData());
					
				}
				return this;
			}
			if(n < 2) {
				var node = this.node();
				return Utils.window(node).getComputedStyle(node, null).getPropertyValue(name);
			}
			priority = "";
			
		}
		Utils.style(name, value, priority).call(this.node(), this.getData());
		return this;
	}
	/**
			@method text
			@param value
			@return String or Views
		*/
		this.text = function(value) {
			if(arguments.length) {
				var func ;
				if(latte_lib.isFunction(value)) {
					func = function() {
						var v = value.apply(this, arguments);
						this.textContent = v = null ? "" : v;
					}
				}else if(value == null) {
					func = function() {
						this.textContent = "";
					}
				}else{
					func = function() {
						this.textContent = value;
					}
				}
				func.call(this.node(), this.getData());
				return this;
			}else{
				return this.node().textContent;
			}
		}
		this.value = function(value) {
			if(arguments.length) {
				var func;
				if(latte_lib.isFunction(value)) {
					func = function() {
						var v = value.apply(this, arguments);
						this.value = v = null? "": v;
					}
				}else if(value == null) {
					func = function() {
						this.value = "";
					}
				}else {
					func = function() {
						this.value = value;
					}
				}
				func.call(this.node(), this.getData());
				return this;
			}else{
				return this.node().value;
			}
		}
		/**
			@method html
			@param value
			@return String or Views
		*/
		this.html = function(value) {
			if(arguments.length) {
				var func ;
				if(latte_lib.isFunction(value)) {
					func = function() {
						var v = value.apply(this, arguments);
						this.innerHTML = v = null ? "" : v;
					}
				}else if(value == null) {
					func = function() {
						this.innerHTML = "";
					}
				}else{
					func = function() {
						this.innerHTML = value;
					}
				}
				func.call(this.node(), this.getData());
				return this;
			}else{
				return this.node().innerHTML;
			}
		}
		/**
			@method on
			@param type  String
			@param listener  Function
			@param capture  Boolean
			@return View or Function
		*/
		this.on = function(type, listener, capture) {
			var n = arguments.length;
			if(n < 3) {
				if(!latte_lib.isString(type)) {
					if(n < 2) listener = false;
					for(capture in type) {
						Utils.on(capture, type[capture], listener);
					}
					return this;
				}
				if(n < 2) {
					return (n = this.node()["__on" + type]) && n.map(function(o) {
						return o._;
					});
				}
				capture = false;
			}
		 	Utils.on( type, listener, capture).call(this.node(), this.getData());
			return this;
		}
			var onceFunc = function(type, listener,capture, self) {
				var once = function() {
					var args = Utils.array(arguments);
					listener.call(this, args);
					self.off(type, once, capture);
				};
				return once;
			}
		/**
			@method off
			@param type  String
			@param listener  Function
			@param capture  Boolean
			@return View or Function
		*/
		this.off = function(type, listener, capture) {
			var n = arguments.length;
			if(n < 3) {
				if(!latte_lib.isString(type)) {
					if(n < 2 ) listener = false;
					var self = this;
					for(var capture in type) {
						Utils.off(capture, type[capture], listener).call(this.node(), this.getData());
					}
					return this;
				}
				if(n < 2) {
					return false;
				}
				capture = false;
			}
			Utils.off(type, listener, capture).call(this.node(), this.getData());
			return this;
		}
		/**
			@method once
			@param type  String
			@param listener  Function
			@param capture  Boolean
			@return View or Function
		*/
		this.once = function(type, listener, capture) {
			var n = arguments.length;
			if(n < 3) {
				if(!latte_lib.isString(type)) {
					if(n < 2) listener = false;
					var self = this;
					for(var capture in type) {
						Utils.on(capture, onceFunc(capture, type[capture], listener, self), listener);
					}
					return this;
				}
				if(n < 2) {
					return false;
				}
				capture = false;
			}
			Utils.on(type, onceFunc(type, listener ,capture, this), capture).call(this.node(), this.getData());
			return this;
		}

		this.transition = function(name) {
			var Transition = require("./transition.js");
			/**
			var id = Transition.latte_transitionInheritId || ++Transition.latte_transitionId,
			ns = Transition.latte_transitionNamespace(name), 
			subgroups = [], subgroup, node, 
			transition = Transition.latte_transitionInherit || {
					time: Date.now(),
			      	ease: latte_ease_cubicInOut,
			      	delay: 0,
			      	duration: 250
	    	};
	    	var dom = this.node();
	    	Transition.latte_transitionNode(dom, 0, ns, id, transition);
	    	*/
	    	return Transition.create(this.node(), name);
		}
		this.getData = function() {
			return Utils.getData(this.node());
		}

		this.node = function() {
			return this.dom;
		}
		Object.defineProperty(this, "children" , {
			get: function() {
				return this.dom.children;
			}
		});
		Object.defineProperty(this, "childNodes", {
			get: function() {
				return this.dom.childNodes;
			}
		});
		Object.defineProperty(this, "value", {
			get: function() {
				return this.dom.value;
			},
			set : function(value) {
				this.dom.value = value;
			}
		});
		
		this.insertBefore = function(o) {
			if(View.isView(o)) {
				return this.dom.insertBefore(o.node());
			}
			return this.dom.insertBefore(o);
		}
		this.appendChild = function(o) {
			if(View.isView(o)) {
				return this.dom.appendChild(o.node());
			}
			return this.dom.appendChild(o);
		}
		this.removeChild =  function(o) {
			if(View.isView(o)) {
				return this.dom.removeChild(o.node());
			}
			return this.dom.removeChild(o);
		}
		this.removeAll = function() {
			this.dom.innerHTML = "";
		}

		

}).call(View.prototype);
(function() {
	this.create = function(dom) {
		if(latte_lib.isString(dom)) {
			dom = Utils.select(dom, document);
		}
		return new View(dom);
	}
	var self = this;
	var tags = {
		latte: "div"
	}
	this.ladeCreateDom = function(lade) {
		var element = document.createElement(lade.tag);
		var view = new View(element);
		view.attr(lade.attribute.data);
		view.style(lade.style.data);
		view.latte(lade.latte);
		view.text(lade.text);
		lade.childrens.forEach(function(c) {
			var v = self.ladeCreateDom(c);
			view.appendChild(v);
		});
		return view;
	}
	this.isView = function(o) {
		return o instanceof View;
	}
}).call(View);
module.exports = View;