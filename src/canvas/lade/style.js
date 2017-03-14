var latte_lib = require("latte_lib");
var Style = function(style) {
	this.data = style || {};
	this.cache = {};
	var self = this;
	["x", "y", "width", "height", "backgroundColor", 
	"zIndex", "lineWidth", "opacity", "position"].forEach(function(k) {
		Object.defineProperty(self, k, {
		  get: function() { return self.get(k); },
		  set: function(newValue) { self.set(k, newValue) },
		  enumerable: true,
		  configurable: true
		});
	});
};
latte_lib.extends(Style, latte_lib.events);
(function() { 
	this.setCache = function(cache) {
		var old = cache;
		this.cache = cache;
		this.emit("updateCache", cache, old);
	}
	this.get = function(name) {
		return this.data[name] || this.cache[name];
	}
	this.set = function(name, value) {
		var old = this.data[name];
		this.data[name] = value;
		this.emit(name, value);
		this.emit("change", name, value, old);
	};
	this.mergerDefault = function(defaultStyle) {
		var copyStyle = latte_lib.merger(latte_lib.copy(defaultStyle), this.data, this.cache);
		
		return copyStyle;
	}
	
	
}).call(Style.prototype);
module.exports = Style;