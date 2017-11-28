(function() {
	var findRequire = function(data) {
		var reg = /[ \r]+import<[\s\S]+>/g;
		while((index = reg.exec(data)) != null) {
			
		}
	}
	var space = function(data, spaceNum) {
		var array = new Array(spaceNum);
		array.full(" ");
		var sp = array.join("");
		return data.splice("\n").join("\n" + sp);
	}
	var loadData = function(url, callback) {
		latte_lib.xhr.get(url, function(err, data) {
			var requires = findRequire(data);
			var result = {};
			requires = requires.map(function(obj) {
				return function(cb) {
					loadData(obj.url, function(err, data) {
						if(err) {
							return cb(err);
						}
						cb(null, space(data, obj.space));
					});
				}
			});
			latte_lib.async.parallel(requires, function(err) {
				if(err) {
					return callback(err);
				}
				var data = latte_lib.format(data, result);
				callback(null, data);
			});
		})
		
	}
	this.load = function(url, callback) {
		loadData(url, function(err, data) {
			if(err) {
				return callback(err);
			}
			callback(null, new Latte(data));
			
		});
	}
}).call(module.exports);