var latte_lib = require("latte_lib");
var Lade = require("./lade");
(function() {
	var self = this;
	var objectToLade = function(data) {
		if(self.isLade(data)) {
			return data;
		}
		var ladeObject = new LadeObject(data);
		if(data.childrens) {
			data.childrens.forEach(function(c) {
				var child = objectToLade(c);
				ladeObject.appendChild(child);
			});
		}
		
		return ladeObject;
	}
	var parse = this.parse = function(str) {
		try {
			var data = JSON.parse(str);
		 	return objectToLade(data);
		}catch(e) {
			console.log(e);
			//return null;
		}
		try {
			var data = Lade.toObject(str);
			return objectToLade(data);
		}catch(e) {
			console.log(e);
			
		}
		return null;
	}
		var Style = require("./style")
			, Attribute = require("./attribute");
			var latteObjectAttributes = ["scrollTop", "scrollLeft"];
		var LadeObject = function(object) {
			this.tag = object.tag || "latte";
			this.id = object.id ;
			this.glasss = object.glasss || [];
			this._style = new Style(object.style);
			this._attribute = new Attribute(object.attribute);
			this._latte = object.latte || {};
			this.text = object.text;
			this.childrens = [];
			if(object.latteView) {
				this.updateLatteView(object.latteView);
			}
			this._style.on("zIndex", function() {
				self.changezIndex && self.changezIndex();
			});
			this._style.on("change", function() {
				self.changeStyle && self.changeStyle();
			});
			this._style.on("updateCache", function(cache, old) {
				if(Object.keys(cache) == 0 && Object.keys(old) == 0) {
					return;
				}

				if(old.zIndex != cache.zIndex) {
					self.changezIndex && self.changezIndex();
				}
				self.changeStyle && self.changeStyle;
				
			});
			this._attribute.on("change", function() {
				self.deleteCache();
			});
			this._scrollTop = 0;
			this._scrollLeft = 0;
			var self = this;
			
			latteObjectAttributes.forEach(function(k) {
				Object.defineProperty(self, k, {
				  	get: function() { return self["_"+k]; },
				  	set: function(newValue) { 
					  	newValue = newValue - 0;
				  		if(isNaN(newValue) ) {
				  			return;
				  		} 
				  		if(newValue == self["_"+k]) {
				  			return;
				  		}
				  		self["_"+k] = newValue < 0? 0 : newValue; 
				  		//self.deleteCache();
			  		},
				  enumerable: true,
				  configurable: true
				});
			});
			
		};
		latte_lib.extends(LadeObject, latte_lib.events);
		(function() {
			this.latte = function(key, value) {
				var n = arguments.length;
				if(n == 1){
					if(latte_lib.isObject(key)) {
						for(var i in key) {
							this.latte(i, key[i]);
						}
					}
					if(latte_lib.isString(key)) {
						return this._latte[key];
					}
				}else if(n == 0) {
					return this._latte;
				}else{
					this._latte[key] = value;
				}
				
			}
			this.attr = function(key, value) {
				var n = arguments.length;
				if(n == 1) {
					if(latte_lib.isObject(key)) {
						for(var i in key) {
							this.attr(i, key[i]);
						}
					}
					if(latte_lib.isString(key)) {
						return this._attribute[key];
					}
				}else if(n == 0){
					return this._attribute.data;
				}else {
					this._attribute[key] = value;
				}
			}
			this.style =function(key, value) {
				var n = arguments.length;
				if(n == 1) {
					if(latte_lib.isObject(key)) {
						for(var i in key) {
							this.style(i, key[i]);
						}
					}
					if(latte_lib.isString(key)) {
						return this._style[key];
					}
				}else if(n == 0) {
					return this._style.data;
				}else{
					this._style[key] = value;
				}
			}
			this.classed = function(key, value) {
				var n = arguments.length;
				if(n == 0) {
					return this.glasss;
				}
				var index = this.glasss.indexOf(key);
				if(value && index == -1) {
					this.glasss.push(key);
				}else if(!value && index != -1) {
					this.splice(index, 1);
				}
			}

			this.deleteCache = function() {
				var o = this;
				var zIndex = o.style.zIndex;
				while(o) {
					if(o.style.zIndex != zIndex) {
						break;
					}
					delete o.cache;
					o = o.parent;
				}
			}
			this.updateLatteView = function(latteView) {
				if(!latteView) {
					return;
				}
				if(this.latteView && this.latteView == latteView) {
					return;
				}
				this.latteView = latteView;
				var self = this;
				this.changezIndex = function() {
					latteView.layers = null;
				}
				this.changeStyle = function() {
					self.deleteCache();
				}
				var cache = latteView.lcss.query(this);
				this.style.setCache(cache);
				this.updateChildLatteView(latteView);
			}
			this.updateChildLatteView = function(latteView) {
				this.childrens.forEach(function(c) {
					c.updateLatteView(latteView);
				});
			}
			this.appendChild = function(o) {
				this.childrens.push(o);
				o.parent = this;
				this.emit("appendChild", o);				
				if(this.latteView){ 
					o.updateLatteView(this.latteView) 
				}
			}
			this.removeLatte = function() {
				this.cache = null;
				this.latteView = null;
				this.changezIndex = null;
				this.changeStyle = null;
				this.updateCache = null;
			}
			this.removeChild = function(o) {
				var index = this.childrens.indexOf(o);
				this.childrens.splice(index , 1);	
				this.emit("removeChild", o);
				o.parent = null;
				o.removeLatte();
			}
			this.changeParent = function(nowParent) {
				this.parent.removeChild(this);
				nowParent.appendChild(this);
			}
			this.removeAllChild = function() {
				this.childrens.forEach(function(o) {
					o.parent = null;
					this.emit("removeChild", o);
				});
			}
		}).call(LadeObject.prototype);
	this.create = function(object) {
		var lade = objectToLade(object);
		return lade;
	}
	this.isLade = function(o) {
		return o instanceof LadeObject;
	}
	/**
		现在只有存在一层
	*/
	this.loadFile = function(file, callback) {
		var loader = require("../loader/index.js");
		loader.loadFile(file, function(err, str) {
			var funcs = [];
			var endIndex = 0;
			var startIndex = 0;
			while((startIndex = str.indexOf("require(", endIndex))!= -1) {
				
				(function() {
					endIndex = str.indexOf(")", startIndex);
					var filename = str.substring(startIndex+8, endIndex);
					funcs.push(function(cb) {
						loader.loadFile(loader.pathJoin(file, ".." ,filename), function(err, str) {
							cb( err, {
								filename: filename,
								data: str
							});
						});
					});
				})();
				
			}
			if(funcs.length == 0) {
				return callback(null, parse(str));
			}
			latte_lib.async.parallel(funcs, function(err, data) {
				if(err) {
					return callback(err);
				}
				data.forEach(function(d) {
					var rf = "require(" +d.filename + ")";
					var index = str.indexOf(rf);
					if(index == -1) {
						return console.log("code error ", rf, index);
					}
					var nindex = str.lastIndexOf("\n", index) || 0;
					var n = str.substring(nindex, index);
					var nd = d.data.split("\n").map(function(o) {
						return n + o;
					}).join("\n");
					str = str.substring(0, nindex) + nd + str.substring(index + rf.length);
				});
				console.log(str);
				return callback(null, parse(str));
			})
			;
		});
	}
}).call(module.exports);