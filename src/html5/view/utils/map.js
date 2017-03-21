(function() {
	var latte_lib = require("latte_lib");
	var Map  =  (function() {
		var Collection = require("./collection.js");
		var Map = function() {
			this._ = Object.create(null);
		};
		var latte_map_proto = "__proto__"
			, latte_map_zero = "\x00";
		latte_lib.inherits(Map, Collection);
		(function() {
			this.get = function(key) {
				return this._[this.escape(key)];
			}
			this.set = function(key, value) {
				return this._[this.escape(key)] = value;
			}
			this.remove = function(key) {
				return (key = this.escape(key)) in this._ && delete this._[key];
			}
			this.keys = Collection.keys;
			this.values = function() {
				var values = [];
				for(var key in this._) values.push(this._[key]);
					return values;
			}
			this.entries = function() {
				var entries = [];
				for(var key in this._) entries.push({
					key: this.unescape(key),
					value: this._[key]
				});
				return entries;
			}
			this.forEach = function(f) {
				var self = this;
				for (var key in this._) {
					f.call(this, this.unescape(key), this._[key]);
				}				
			}
		}).call(Map.prototype);
		return Map;
	})();
	this.create = function(object, f) {
		var map = new Map();
			if(object instanceof Map) {
				object.forEach(function(key, value) {
					map.set(key, value);
				});
			}else if(Array.isArray(object)) {
				var i = -1, n = object.length, o;
	      		if (arguments.length === 1) while (++i < n) map.set(i, object[i]); else while (++i < n) map.set(f.call(object, o = object[i], i), o); 
			}else{
				for(var key in object) map.set(key, object[key]);
			}
			return map;
	}
}).call(module.exports);