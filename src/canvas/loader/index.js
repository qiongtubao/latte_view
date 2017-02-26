var Loader = function() {
	this.cache = {};
};
(function() {
	this.loadView = function(url, callback) {
		this.load(url, function(err, data) {
			if(err) { return callback(err, data);}
			var data =lade.parse(data);
			callback(null, data);
		});
	}
}).call(module.exports);