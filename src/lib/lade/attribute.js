var latte_lib = require("latte_lib");
var attributes = ["selected", "src"];
var Attribute = function(attr) {
	this.data = attr || {};
	var self = this;
	attributes.forEach(function(k) {
		Object.defineProperty(self, k, {
		  get: function() { return self.get(k); },
		  set: function(newValue) { self.set(k, newValue) },
		  enumerable: true,
		  configurable: true
		});
	});
};
latte_lib.extends(Attribute, latte_lib.events);
(function() {
	this.get = function(k) {
		return this.data[k];
	}
	this.set = function(name, value) {
		var old = this.data[name];
		if(old == value) {
			return;
		}
		this.data[name] = value;
		this.emit(name, value);
		this.emit("change", name, value, old);
	}

}).call(Attribute.prototype);
(function() {
	this.addAttributeType = function(name) {
		if(attributes.indexOf(name) == -1) {
			attributes.push(name);
		}
		
	}
}).call(Attribute);
module.exports = Attribute;
