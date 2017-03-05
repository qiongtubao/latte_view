var latte_lib = require("latte_lib");
(function() {
	var objectToLade = function(data) {
		var ladeObject = new LadeObject(data);
		if(data.childrens) {
			data.childrens.forEach(function(c) {
				var child = objectToLade(c);
				ladeObject.appendChild(child);
			});
		}
		
		return ladeObject;
	}
	this.parse = function(str) {
		try {
			var data = JSON.parse(str);
		 	return objectToLade(data);
		}catch(e) {
			console.log(e);
		}

	}
		var LadeObject = function(object) {
			this.tag = object.tag || "latte";
			this.id = object.id ;
			this.style = object.style || {};
			this.latte =object.latte || {};
			this.attribute = object.attribute || {};
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