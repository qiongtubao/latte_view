(function() {
	this.stringRegExp = function(str, prefix , suffix) {
		prefix = prefix || "{{";
		suffix =  suffix || "}}";
		var vernier = 0;
		var next = 1;
		var keys = [];
		while(next) {
			var startIndex = str.indexOf(prefix, vernier);
			if(startIndex == -1) {
				next = 0;
				return keys;
			}
			var endIndex = str.indexOf(suffix, startIndex);
			if(endIndex == -1) {
				next = 0;
				return keys;
			}
			keys.push(str.substring(startIndex+prefix.length, endIndex));
			vernier = endIndex;
		}
		
	}
	this.language = require("./language");
}).call(module.exports);