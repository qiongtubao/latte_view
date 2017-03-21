var latte_lib = require("latte_lib");
var Language = function(language) {
	this.language = language;
	this.data =  {};
};
latte_lib.inherits(Language, latte_lib.events);
(function() {
	this.load = function(language, path, callback) {
		var self = this;
		self.language = language;
		latte_lib.xhr.get(path, {}, function(data) {
			try {
				data = JSON.parse(data);
			}catch(e) {
				console.error("language page json  format is Error");
				callback && callback(e);
			}
			self.set(language, data);
			callback && callback();
		}, function(err) {
			console.error("language page ajax Error", err);
			callback && callback(err);
		});
	}	
	this.get = function(name) {
		return this.data[this.language][name];
	}
	this.set = function(language, data) {
		var self = this;
		this.language = language;
		self.data[language] = self.data[language] || {};
		
		var now = self.data[language];
		for(var i in data) {
			self.emit(i, data[i], self.data[language][i]);
			self.data[language][i] = data[i];
		}
		console.log("change");
		self.emit("change", data, now);

	}
	this.toJSON = function() {
		return this.data[this.language];
	}
}).call(Language.prototype);
module.exports = new Language();