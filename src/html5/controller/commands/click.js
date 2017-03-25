var Command = {};
(function() {
	var View = require("../../view/index.js");
	this.after = function(data, dom, controller) {
		var clickAttribute = dom.latte("click");
		if(clickAttribute) {
			var clickEvent = function(e) {
				var self =  View.create(this);
				if(controller.closed) {
					return controller.unbind("view", "click", clickEvent);
				}
				var events = clickAttribute.split(" ");
				events.forEach(function(eventName) {
					var click = data.get(eventName);
					click && click.call(data, e, self);
				});
			}
			controller.bind("view", "click", clickEvent);
		}
	}
}).call(module.exports);