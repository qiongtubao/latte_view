(function() {
	var self = this;
		var latte_arraySlice = [].slice;
		this.arraySlice = latte_arraySlice;
		this.array = function(list) {
			return latte_arraySlice.call(list);
		}
		var latte_nsPrefix = {
		    svg: "http://www.w3.org/2000/svg",
		    xhtml: "http://www.w3.org/1999/xhtml",
		    xlink: "http://www.w3.org/1999/xlink",
		    xml: "http://www.w3.org/XML/1998/namespace",
		    xmlns: "http://www.w3.org/2000/xmlns/"
	  	};
	  	this.ns = {
		    prefix: latte_nsPrefix,
		    qualify: function(name) {
		      var i = name.indexOf(":"), prefix = name;
		      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
		      return latte_nsPrefix.hasOwnProperty(prefix) ? {
		        space: latte_nsPrefix[prefix],
		        local: name
		      } : name;
		    }
	  	};
	this.window = function(node) {
    	return node && (node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView);
  	}
		var collapse = this.collapse =function(s) {
	    	return s.trim().replace(/\s+/g, " ");
	  	}
		var classedName = this.classedName = function (name) {
		    var re = self.classedRe(name);
		    return function(node, value) {
		      if (c = node.classList) return value ? c.add(name) : c.remove(name);
		      var c = node.getAttribute("class") || "";
		      if (value) {
		        re.lastIndex = 0;
		        if (!re.test(c)) node.setAttribute("class", self.collapse(c + " " + name));
		      } else {
		        node.setAttribute("class", self.collapse(c.replace(re, " ")));
		      }
		    };
		}
		var requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
		this.requote = function(s) {
	    	return s.replace(requote_re, "\\$&");
	  	};
		this.classedRe = function(name) {
	   		return new RegExp("(?:^|\\s+)" + self.requote(name) + "(?:\\s+|$)", "g");
	  	}
		this.split_classes = function(name) {
			return (name + "").trim().split(/^|\s+/);
		}
	this.classed = function(name, value) {
		name = self.split_classes(name).map(self.classedName);
		var n = name.length;
		function classedConstant() {
	      var i = -1;
	      while (++i < n) name[i](this, value);
	    }
	    function classedFunction() {
	      var i = -1, x = value.apply(this, arguments);
	      while (++i < n) name[i](this, x);
	    }
	    return typeof value === "function" ? classedFunction : classedConstant;
	} 
	

	this.style = function(name, value, priority) {
		function styleNull() {
	      	this.style.removeProperty(name);
	    }
	    function styleConstant() {
	      this.style.setProperty(name, value, priority);
	    }
	    function styleFunction() {
	      	var x = value.apply(this, arguments);
	      	if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);
	    }
	    return value == null ? styleNull : typeof value === "function" ? styleFunction : styleConstant;
	}
	this.getAttr = function(name) {
		name = self.ns.qualify(name);
		return name.local? this.getAttributeNS(name.space, name.local) : this.getAttribute(name);
	}
	this.attr = function(name, value) {
		name = self.ns.qualify(name);
		function attrNull() {
	      this.removeAttribute(name);
	    }
	    function attrNullNS() {
	      this.removeAttributeNS(name.space, name.local);
	    }
	    function attrConstant() {
	      this.setAttribute(name, value);
	    }
	    function attrConstantNS() {
	      this.setAttributeNS(name.space, name.local, value);
	    }
	    function attrFunction() {
	      var x = value.apply(this, arguments);
	      if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);
	    }
	    function attrFunctionNS() {
	      var x = value.apply(this, arguments);
	      if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);
	    }
		return  value == null ? 
			name.local ? attrNullNS : attrNull 
			: 
			typeof value === "function" ?  
					name.local ? attrFunctionNS : attrFunction 
			: name.local ? attrConstantNS : attrConstant;
	}
		this.event = null;
		var onListener = function(listener, argumentz) {
			return function(e) {
				var o = self.event;
				self.event = e;
				argumentz[0] = self.getData(this);
				try {
					listener.apply(this, argumentz);
				}catch(e) {
					//console.log(e);
					throw e;
				}finally {
					self.event = o;
				}
			}
		}
		var Map = require("./utils/map.js");
		var onFilters = Map.create({
			mouseenter: "mouseover",
		    mouseleave: "mouseout"
		});

		this.getData = function(dom) {
			return dom.controller && dom.controller.data || dom.__data__;
		}
		var onFilter = function(listener, argumentz) {
			var l = onListener(listener, argumentz);
			return function(e) {
				var target = this, related = e.relatedTarget;
				if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {
		        	l.call(target, e);
		      	}
			}
		}
	
	this.off = function(type, listener, capture) {
		var name = "__on" + type, i = type.indexOf(".");
		if(i > 0) {
			type = type.slice(0, i);
		}
		function onRemove() {
			var l = this[name];
			if(l) {
				var _self = this;
				l.forEach(function(o) {

					if(o._ == listener && o.$ == capture) {
						var index = l.indexOf(o);
						l.splice(index, 1);
						_self.removeEventListener(type, o, capture);
					}
				});

			}
		}
		return onRemove;
	}

	this.on = function(type, listener, capture) {
		var name = "__on" + type, i = type.indexOf("."),
			wrap = onListener;
		if(i > 0) {
			type = type.slice(0, i);
		}
		var filter = onFilters.get(type);
		if(filter) {
			type = filter;
			wrap = onFilter;
		}
		function onRemove() {
			var l = this[name];
			if(l) {
				var _self = this;
				l.forEach(function(o) {
					_self.removeEventListener(type, o, o.$);
				});
				delete this[name];
			}
		}
		function onAdd() {
			var l = wrap(listener, self.array(arguments));
			//onRemove.call(this);
			this.addEventListener(type,  l, l.$ = capture);
			this[name] = this[name] || [];
			l._ = listener;
			this[name].push(l);
		}
		function removeAll() {
			var re = new RegExp("^__on[^.]+)" + self.requote(type) + "$"), match;
			for(var name in this) {
				if(match = name.match(re)) {
					var l = this[name];
					var self = this;
					l.forEach(function(o) {
						self.removeEventListener(match[1], o, o.$);
					});
					delete this[name];
				}
			}
		}
		return i ? listener ? onAdd: onRemove : listener? latte_noop: removeAll;
	}
			
			function latte_interpolateArray(a, b) {
			    var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i;
			    for (i = 0; i < n0; ++i) x.push(latte_interpolate(a[i], b[i]));
			    for (;i < na; ++i) c[i] = a[i];
			    for (;i < nb; ++i) c[i] = b[i];
			    return function(t) {
			      for (i = 0; i < n0; ++i) c[i] = x[i](t);
			      return c;
			    };
		  	}
	  		var latte_interpolateObject = function(a, b) {
			    var i = {}, c = {}, k;
			    for (k in a) {
			      if (k in b) {
			        i[k] = latte_interpolate(a[k], b[k]);
			      } else {
			        c[k] = a[k];
			      }
			    }
			    for (k in b) {
			      if (!(k in a)) {
			        c[k] = b[k];
			      }
			    }
			    return function(t) {
			      for (k in i) c[k] = i[k](t);
			      return c;
			    };
		  	}
		  	var latte_interpolateNumber = function(a, b) {
				a = +a, b = +b;

				return function(t) {
					return a * (1 - t) + b * t;
				};
			}
			var latte_interpolate_numberA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, 
		  			latte_interpolate_numberB = new RegExp(latte_interpolate_numberA.source, "g");
			var latte_interpolateString = function(a,b) {
				var bi = latte_interpolate_numberA.lastIndex = latte_interpolate_numberB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
				    a = a + "", b = b + "";
				    while ((am = latte_interpolate_numberA.exec(a)) && (bm = latte_interpolate_numberB.exec(b))) {
						if ((bs = bm.index) > bi) {
							bs = b.slice(bi, bs);
							if (s[i]) s[i] += bs; else s[++i] = bs;
						}
				      	if ((am = am[0]) === (bm = bm[0])) {
				        	if (s[i]) s[i] += bm; else s[++i] = bm;
				      	} else {
				        	s[++i] = null;
				        	q.push({
				          		i: i,
				          		x: latte_interpolateNumber(am, bm)
			        		});
				      	}
				      	bi = latte_interpolate_numberB.lastIndex;
				    }
				    if (bi < b.length) {
				      	bs = b.slice(bi);
				      	if (s[i]) s[i] += bs; else s[++i] = bs;
				    }
				    return s.length < 2 ? q[0] ? (b = q[0].x, function(t) {
				      	return b(t) + "";
				    }) : function() {
				      	return b;
				    } : (b = q.length, function(t) {
				      	for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
				      		return s.join("");
				    });
			}
			var Rgb = require("./utils/rgb.js");
			var latte_rgb_hex= Rgb.rgb_hex;
			var latte_interpolateRgb = function(a, b) {
	  			a = Rgb.rgb(a);
			    b = Rgb.rgb(b);
			    var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;
			    return function(t) {
			      	return "#" + latte_rgb_hex(Math.round(ar + br * t)) + latte_rgb_hex(Math.round(ag + bg * t)) + latte_rgb_hex(Math.round(ab + bb * t));
			    };
	  		}
	  		var Color = require("./utils/color.js").color;
	  		var RgbNames = Rgb.rgbs;
		var interpolators = [ function(a, b) {
		    var t = typeof b;
		    return (t === "string" ? 
		    	RgbNames.has(b.toLowerCase()) || 
		    	/^(#|rgb\(|hsl\()/i.test(b) ? 
		    		latte_interpolateRgb : latte_interpolateString 
		    		: b instanceof Color ? 
		    		latte_interpolateRgb : Array.isArray(b) ? 
		    		latte_interpolateArray : t === "object" 
		    		&& isNaN(b) ? latte_interpolateObject : 
		    		latte_interpolateNumber)(a, b);
	  	} ];
	/**
		transition
	*/
  	var latte_interpolate = this.latte_interpolate = function(a, b) {
  		var i = interpolators.length, f;
			while (--i >= 0 && !(f = interpolators[i](a, b))) ;
		return f;
  	}
	this.select = function(name, node) {
		return node.querySelector(name);
	}
	this.selectAll = function(name, node) {
		return node.querySelectorAll(name);
	}
}).call(module.exports);