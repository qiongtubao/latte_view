var latte_lib = require("latte_lib");
var Lcss = function(dom) {
	this.binds = {};
	this.dom = dom;
};
(function() {
	this.bind = function(value, key, o) {

	}
	this.set = function(key, value) {

	}
	this.change = function(k, v) {

	}
}).call(Lcss.prototype);
(function() {
	this.create = function() {
		
	}
}).call(Lcss);
var LatteObject = require("latte_lib").object;
(function() {
	this.after = function(data, dom, controller) {
		var lcssAttribute = dom.latte("lcss");
		if(lcssAttribute) {
			var lcss = Lcss.create(lcssAttribute, dom);
			for(var i  in lcss.binds) {
				lcss.change(i, data.get(i));

			}
		}
	}
}).call(module.exports);