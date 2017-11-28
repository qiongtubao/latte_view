(function() {
	var Cache = function(config) {
		this.config = config;
		this.caches = {

		};
	};
	(function() {
		this.set = function(key, value) {
			this.caches[key] = {
				timeout: this.config.timeout == -1? -1: this.config.timeout + Date.now()
				value: value
			};
		}
		this.get = function(key) {
			this.checkout();
			if(this.caches[key] && this.caches[key].value) {
				return this.caches[key].value;
			}
			return null;
		} 
		this.checkout = function() {
			if(this.config.timeout == -1) {
				return;
			}
			var nowTime = Date.now();
			var self = this;
			Object.keys(this.caches).forEach(function(key) {
				if(self.caches[key].timeout < nowTime) {
					delete self.caches[key];
				}
			});
		}
	}).call(Cache.prototype);
	var caches = {
		latte: new Cache({
			timeout: -1
		}),
		lcss: new Cache({
			timeout: -1
		})
	};
	var loaders = {
		latte: new Loader(Latte.load),
		lcss: new Loader(Lcss.load)
	};
	this.get = function(type, url, callback) {
		if(caches[type].get(url)) {
			return callback(null, caches[type].get(url));
		}
		loaders[type](url, function(err, obj) {
			if(err) {
				return callback(err);
			}
			caches[type].set(url, obj);
			return callback(null, obj);
		});
	}
	var Loader = function(loader) {
		var loadings = {

		};
		this.load = function(url, callback) {
			if(loadings[url]) {
				return loadings[url].on("finish", callback);
			}
			loadings[url] = new latte_lib.events();
			loadings[url].on("finish", callback);
			loader(url, function(err, data){
				loadings[url].emit("finish", err, data);
				delete loadings[url];
			});
		}
	};

}).call(module.exports);