var latte_lib = require("latte_lib");
(function() {
	this.parse = function(str) {
		
	}
		var LadeObject = function(object) {
			this.style = object.style;
			this.latte =object.latte;
			this.childrens = [];
		};
		latte_lib.extends(LadeObject, latte_lib.events);
		(function() {
			this.appendChild = function(o) {
				this.childrens.push(o);
				o.parent = this;
				this.emit("appendChild", o);
			}
			this.removeChild = function(o) {
				var index = this.childrens.indexOf(o);
				this.childrens.splice(index , 1);	
				this.emit("removeChild", o);
				o.parent = null;
			}
			this.changeParent = function(nowParent) {
				this.parent.removeChild(this);
				nowParent.appendChild(this);
			}
			this.removeAllChild = function() {
				this.childrens.forEach(function(o) {
					o.parent = null;
					this.emit("removeChild", o);
				});
			}
		}).call(LadeObject.prototype);
	this.create = function(object) {
		var lade = new LadeObject(object);
		return lade;
	}
}).call(module.exports);