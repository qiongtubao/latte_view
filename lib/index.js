(function() {
	var Latte = function(config) {
		this.loader = Loader.create();
		this.context = null;
		this.config = config;
		this.status = "ready";
	};
	(function() {
		this.init = function(callback) {
			var self = this;
			this.loader.load(this.config.main, function(err, result) {
				if(err) {
					return callback(err);
				}
				switch(this.config.type) {
					case "html":
						this.initHtml(result, callback);
					break;
					case "canvas":
						this.initCanvas(result, callback);
					break;
					case "ios":
					break;
					case "android":
					break;
				}
			});
			
		}
		this.load = function(config, callback) {
			var result = {};
			var self = this;
			var loadConfig = Object.keys(config).forEach(function(key) {
				return function(cb) {
					self.loader.get(key, config[key], function(err, data) {
						if(err) {
							return cb(err);
						}
						result[key] = data;
						return cb();
					});
				}
			});
			latte_lib.async.parallel(loadConfig, function(err) {
				if(err) {
					return callback(err);
				}
				callback(null, result);
			});
		} 
		this.initHtml = function(result, callback) {

		}	
		this.initCanvas = function() {

		}
	}).call(Latte.prototype);
	this.load = function(config, callback) {
		var latte = new Latte(config);
		latte.init(callback);
		return latte;
	}
}).call(module.exports);