var latte_lib = require("latte_lib");
var lade = require("../lade");
var lcss = require("../lcss");
var Loader = function() {
	this.cache = {};
};
latte_lib.extends(Loader, latte_lib.events);
(function() {

	var loadFile = function(url, callback) {
		latte_lib.xhr.get(url).end(function(err, res) {
			if(err) { return callback(err); }
			callback && callback(null, res.text);
		});
	};
	this.loadFile = function(url, callback, parser) {
		var self = this;
		if(self.cache[url]) {
			if(self.cache[url] == "loading") {
				callback && self.once(url, callback);
				return null;
			}
			callback(null,self.cache[url]);
			return self.cache[url];
		}
		callback && self.once(url, callback);
		self.cache[url] = "loading";
		parser = parser || function(data) {
			return data;
		};
		return loadFile(url, function(err, data) {
			if(err) {
				delete self.cache[url];
				return self.emit(url, err);
			}
			var data = parser(data);
			self.cache[url] = data;
			self.emit(url, null, data);
		});
	}
	this.loadLcss = function(url, callback) {
		this.loadFile(url, callback, lcss.parse);
	}
	this.loadView = function(url, callback) {
		this.loadFile(url, callback, lade.parse);
	}
	var loadImage = function(url, callback) {
		var image = new Image();
		image.status = "loading";
		image.src = url;
		image.onload = function() {
			callback(null, image);
		};
		image.onerror = function(err) {
			callback(err);
		}
		image.onabort = function(err) {
			callback(new Error("onabort"))
		}
		//image.setAttribute("async","true");
		return image;
	}
	this.loadImageSync = this.loadImage = function(url, callback) {
		var self = this;
		if(self.cache[url]) {
			if(self.cache[url].status == "loading") {
				callback && self.once(url, callback);
				return self.cache[url];
			}
			callback && callback(null, self.cache[url]);
			return self.cache[url];
		}
		callback && self.once(url, callback);
		var image = loadImage(url, function(err) {
			
			
			if(err) {
				delete self.cache[url];
				self.emit(url, err);
				return;
			}
			
			delete image.status;
			self.emit(url, null, image, 1);
		});
		
		self.cache[url] = image;
		return image;
	}
	this.loadAnimation = function(url, callback) {
		this.loadFile(url, callback, JSON.parse.bind(JSON));
	}
}).call(Loader.prototype);
module.exports = new Loader();