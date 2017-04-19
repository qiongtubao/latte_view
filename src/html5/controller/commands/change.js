var Command = {};
(function() {
	this.after = function(data, dom, controller) {
		var clickAttribute = dom.latte("change");
		if(clickAttribute) {
			if(dom.latte("duplex")) {
				var changeEvent = function(now, old) {
					if(controller.closed) {
						return controller.unbind("data", dom.latte("duplex"), changeEvent);
					}
					var events = clickAttribute.split(" ");
					events.forEach(function(eventName) {
						var change = data.get(eventName);
						change && change.call(data, now, old);
					});
				}
				//data.on(dom.latte("duplex"), );
				controller.bind("data", dom.latte("duplex"), changeEvent);
			}else{
				var changeEvent = function(now, old) {
					if(controller.closed) {
						return controller.unbind("view", "onpropertychange", changeEvent);
					}
					var events = clickAttribute.split(" ");
					events.forEach(function(eventName) {
						var change = data.get(eventName);
						change && change.call(data, now, old);
					});
				}
				controller.bind("view", "onpropertychange", changeEvent);
			}
		}
	}
}).call(Command);
module.exports = Command;