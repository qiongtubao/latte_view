var Command = {};
(function() {
	this.after = function(data, dom, controller) {
		var clickAttribute = dom.latte["mousemove"];
		if(clickAttribute) {
			var clickEvent = function(e) {
				if(controller.closed) {
					return controller.unbind("view", "mousemove", clickEvent);
				}
				var events = clickAttribute.split(" ");
				e.dom = dom;
				events.forEach(function(eventName) {
					var mousemove = data.get(eventName);
					mousemove && mousemove.call(data, e);
				});
			}
			controller.bind("view", "mousemove", clickEvent);
		}
	}
}).call(Command);
module.exports = Command;