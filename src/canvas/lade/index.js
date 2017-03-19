var latte_lib = require("latte_lib");
var Lade = require("./lade");
(function() {
	var objectToLade = function(data) {
		var ladeObject = new LadeObject(data);
		if(data.childrens) {
			data.childrens.forEach(function(c) {
				var child = objectToLade(c);
				ladeObject.appendChild(child);
			});
		}
		
		return ladeObject;
	}
	this.parse = function(str) {
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
			this.style = new Style(object.style);
			this.attribute = new Attribute(object.attribute);
			this.latte = object.latte || {};
			this.text = object.text;
			this.childrens = [];
			if(object.latteView) {
				this.updateLatteView(object.latteView);
			}
			this.style.on("zIndex", function() {
				self.changezIndex && self.changezIndex();
			});
			this.style.on("change", function() {
				self.changeStyle && self.changeStyle();
			});
			this.style.on("updateCache", function(cache, old) {
				if(Object.keys(cache) == 0 && Object.keys(old) == 0) {
					return;
				}

				if(old.zIndex != cache.zIndex) {
					self.changezIndex && self.changezIndex();
				}
				self.changeStyle && self.changeStyle;
				
			});
			this.attribute.on("change", function() {
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
		var lade = new LadeObject(object);
		return lade;
	}
}).call(module.exports);