var Collection = function() {
	this._ = Object.create(null);
};
var proto = "__proto__", zero = "\x00";
(function() {
	this.escape = function(key) {
		return (key += "") === proto || key[0] === zero ? zero + key : key;
	}
	this.unescape = function(key) {
		return (key += "")[0] === zero ? key.slice(1) : key;
	}
	var self = this;
	this.keys = function() {
		var keys = [];
	    for (var key in this._) keys.push(self.unescape(key));
	    return keys;
	}
}).call(Collection);
(function() {
	
	this.escape = Collection.escape;
	this.unescape = Collection.unescape;
	this.has = function(key) {
		return this.escape(key) in this._;
	}
	this.remove = function(key) {
		return (key = this.escape(key)) in this._ && delete this._[key];
	}

	this.size = function() {
		var size = 0;
		for(var key in this._) {
			++size;
		}
		return size;
	}
	this.empty = function() {
		for(var key in this._) {
			return false;
		}
		return true;
	}
}).call(Collection.prototype);

module.exports = Collection;