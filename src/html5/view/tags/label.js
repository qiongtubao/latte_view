(function() {
	this.init = function(object) {
		if(object.parent.style.flex != "row") {
			object.tag = "p";
		}
		return object;
	}
}).call(module.exports);