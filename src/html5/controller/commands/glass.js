var latte_lib = require("latte_lib"),
	LatteObject =latte_lib.object ,
	lib = require("../../lib/index.js");
var Command = {};
(function() {
	this.after = function(data, view, controller) {
		
		var classStr = view.latte("glass");
		if(classStr) {
			var ifs = lib.stringRegExp(classStr, "{!", "!}");
			var json = {};
			ifs.forEach(function(key) {
				console.log(key);
				var split1s = key.split("?");
				var k = split1s[0].trim();
				
				var split2s = split1s[1].split(":");
				
				var change = function(value, old) {
					if(value == old) {return;}
					if(split2s[0].trim() != "") {
						view.classed(split2s[0].trim() ,value);
					}
					if(split2s[1].trim() != "") {
						view.classed(split2s[1].trim(), !value);
					}

					
				};
				classStr = classStr.replace("{!"+key+"!}", data.get(k)? split2s[0].trim():split2s[1].trim());
				controller.bind("data", k, change);

			});
			var keys = lib.stringRegExp(classStr);
			

			keys.forEach(function(key) {
				json[key] = data.get(key) || "";
				var change = function(value, oldValue) {
					if(controller.closed) {
						controller.unbind("data", key, change);
					}

					view.classed(oldValue, 0);
					view.classed(value, 1);
					
				}
				controller.bind("data", key, change);
				
			});
	
			view.node().className = view.node().className + " " +latte_lib.format.templateStringFormat(classStr, json);
			
		}
		

	};
}).call(Command);

module.exports = Command;