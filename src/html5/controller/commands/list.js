var Command = {};
(function() {
	this.beforeLevel  = 1;
	this.before = function(data, view, controller) {
		var list = view.latte("list");
		var Controller = require("../index.js");
		if(list) {
			var child = view.children[0];
			view.removeChild(child);
			var setFunc = function(i,value, old) {
				Controller.remove(view.children[i], old);
				Controller.create(view.children[i], value);
			}
			var spliceFunc= function(startIndex, removes, adds) {
				var num = removes.length;
				for(var i = 0;i < num; i++) {
					var o = view.children[startIndex];
					view.removeChild(o);
					Controller.remove(o);
				}
				var afterDom = view.children[startIndex];
				var list = this;
				adds.forEach(function(add) {
					var cloneChild = child.cloneNode(true);
					if(afterDom) {
						view.insertBefore(cloneChild, afterDom);
					}else{
						view.appendChild(cloneChild);
					}			
					
					Controller.create(cloneChild, add);
				});
			}
			var change = function(value, oldValue) {
				
				for(var i = 0, len = view.children.length; i < len; i++) {
					var c = view.children[0];
					Controller.remove(c);
					view.removeChild(c);
				}

				for(var i = 0, len = value.length; i < len; i++) {
					(function(i) {
						var cloneChild = child.cloneNode(true);					
						view.appendChild(cloneChild);
						Controller.create(view.children[i], value.get(i));
					})(i);
					
				}
				if(oldValue) {
					oldValue.off("set", setFunc);
					oldValue.off("splice", spliceFunc)
				}
				
				value.on("set", setFunc);
				value.on("splice", spliceFunc);
				
			}


			controller.bind("data", list, change);
	
			change(data.get(list));
		}
	}
}).call(Command); 
module.exports = Command;