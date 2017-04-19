(function() {
	var latte_lib = require("latte_lib");
	var lib = require("../../lib/index.js");
		var forEachJSON = function(data, key, result) {
			for(var i in data) {
				
				if(latte_lib.isObject(data[i])) {
					var ckey = latte_lib.clone(key);
					ckey.push(i);
					forEachJSON(data[i], ckey, result);
				}else if(latte_lib.isArray(data[i])){
					var ckey = latte_lib.clone(key);
					ckey.push(i);
					forEachJSON(data[i], ckey, result);
				}else{
					var ckey = latte_lib.clone(key);
					ckey.push(i);
					result[ckey.join(".")] = data[i] != null ?data[i].toString(): "undefined";
					

				}
			}
		}
	var toJSON = function(data) {

		if(latte_lib.isObject(data)) {
			return JSON.stringify(data.toJSON());
		}else if(latte_lib.isString(data)){
			return '"' + data +'"'
		}else{
			return JSON.stringify(data);
		}
		
	}
	this.after = function(data, dom, controller) {
		var showValue = dom.latte("show");
		if(showValue) {
			var key1s = lib.stringRegExp(showValue, "{{", "}}");
			var doChange = function() {
				var text = showValue;
				var j = {};
				key1s.forEach(function(key) {
					j[key] = toJSON(data.get(key));
				});
				text = latte_lib.format.templateStringFormat(text, j);
				if(!!eval(text)) {
					dom.style("display", "");
				}else{
					dom.style("display", "none");
				}
			};
			doChange();
			key1s.forEach(function(key) {
				controller.bind("data", key, function(value, oldValue) {
					doChange();
				});
			});
			/**

			var doChange = function(v) {
				if(v) {
					dom.style("display", "");
				}else{
					dom.style("display", "none");
				}
			};
						controller.bind("data", showValue, function(value, oldValue) {
				doChange(value);
			});
			doChange(data.get(showValue));
			*/
		}
	}
}).call(module.exports);