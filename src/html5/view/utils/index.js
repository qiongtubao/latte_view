(function() {
	var latte_vendorPrefixes = [ "webkit", "ms", "moz", "Moz", "o", "O" ];
	this.latte_vendorSymbol = function(object, name) {
	    if (name in object) return name;
	    name = name.charAt(0).toUpperCase() + name.slice(1);
	    for (var i = 0, n = latte_vendorPrefixes.length; i < n; ++i) {
	      var prefixName = latte_vendorPrefixes[i] + name;
	      if (prefixName in object) return prefixName;
	    }
  	}
}).call(module.exports);