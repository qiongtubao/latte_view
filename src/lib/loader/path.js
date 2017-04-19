(function() {
	this.basename = function(path, etx) {
		var paths = path.split("/");
		var o = paths[paths.length - 1];
		if(etx) {
			var index = o.indexOf(etx);
			if(index == -1) {
				return o;
			}else{
				return o.substring(0, index);
			}
		}else{
			return o;
		}
	}
	this.dirname = function(path) {
		var paths = path.split("/");
		return paths.pop().join("/");
	}
	this.extname = function(path) {
		var paths = path.split(".");
		if(paths.length == 1) {
			return "";
		}else{
			return "." + paths[paths.length -1]
		}
	}
	this.join = function() {
		var args = Array.prototype.slice.call(arguments);
		var arg = [];
		args.forEach(function(o) {
			if(o[0] == "/") {
				arg = [o];
			}else{
				arg.push(o);
			}
		});
		var array = [];
		arg.join("/").split("/").forEach(function(a) {
			if(a == ".." && array.length > 1) {
				array.pop();
			}else if(a == ".") {
				
			}else{
				array.push(a);
			}
		});
		return array.join("/");
	}
	
}).call(module.exports);