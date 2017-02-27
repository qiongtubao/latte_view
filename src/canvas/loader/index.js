var latte_lib = require("latte_lib");
var Loader = function() {
	this.cache = {};
};
latte_lib.extends(Loader, latte_lib.events);
(function() {
	var loadFile = function(url, callback) {
		latte_lib.xhr.get(url).end(function(err, res) {
			if(err) { return callback(err); }
			callback(null, res.text);
		});
	};
	this.loadView = function(url, callback) {
		var self = this;
		if(self.cache[url]) {
			if(self.cache[url] == "loading") {
				self.once(url, callback);
				return null;
			}
			return self.cache[url];
		}
		self.once(url, callback);
		self.cache[url] = "loading";
		return loadFile(url, function(err, data) {
			if(err) { 
				delete self.cache[url];
				return self.emit(url, err);
			}
			var data =lade.parse(data);
			self.cache[url] = data;
			self.emit(url, null, data);
		});
	}
	var loadImage = function(url, callback) {
		var image = new Image();
		image.src = url;
		image.onload = callback;
		return image;
	}
	this.loadImageSync = this.loadImage = function(url, callback) {
		if(self.cache[url]) {
			if(self.cache[url].status == "loading") {
				callback && self.once(url, callback);
				return self.cache[url];
			}
			callback && callback(null, self.cache[url]);
			return self.cache[url];
		}
		self.once(url, callback);
		var image = loadImage(url, function(err) {
			if(err) {
				delete self.cache[url];
				self.emit(url, err);
				return;
			}
			delete image.status;
			self.emit(url, null, image);
		});
		image.status = "loading";
		self.cache[url] = image;
		return image;
	}
}).call(module.exports);