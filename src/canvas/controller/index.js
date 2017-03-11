var latte_lib = require("latte_lib")
	, LatteObject = latte_lib.object
	, View = require("../view/index.js");
var Controller = function(view, data) {
	view.latteController = this;
	this.dom = view;
	//view = this.view = View.create(view);
	this.view = view;
	if(view.latte["template"]) {
		view.appendChild(data.get(view.latte["template"]));
	}
	if(view.latte["data"]) {
		this.data = data.get(view.latte["latte-data"]);
	}else{
		this.data = data;
	}
	if(!this.data) {
		console.log(data, view.latte["data"]);
		throw new Error("data " + view.latte["data"] + " Error");
	}
	this.dataEvents = {};
	this.viewEvents = {};
	var self = this;
	Controller.befores.forEach(function(command) {
		command(self.data, view, self);
	});
	Controller.middle(self.data, view, self);
	Controller.afters.forEach(function(command) {
		command(self.data, view, self);
	});
	this.emit("finish");
};
latte_lib.extends(Controller, latte_lib.events);
(function() {
	this.bind = function(type, eventType, funcs, ops) {
		if(!latte_lib.isArray(funcs)) {
			funcs = [funcs];
		}
		var f, events = this[type + "Events"];
		f = this[type].on.bind(this[type]);
		for(var i = 0, len = funcs.length; i < len; i++) {
			var func = funcs[i];
			if(!latte_lib.isFunction(func)) {
				console.error("add function Error")
				return;
			}
			f(eventType, func);
		}
		events[eventType] = funcs.concat(events[eventType]);
	}
	this.unbind = function(type, eventType, funcs) {
		var f, events = this[type + "Events"];
		if(!latte_lib.isArray(funcs)) {
			funcs = [funcs];
		}
		f = this[type].off.bind(this[type]);
		for(var i = 0, len = funcs.length ; i < len ; i++) {
			var func = funcs[i]
				, fIndex = events[eventType].indexOf(func);
			if(fIndex == -1) {
				console.error("not find the func");
				return;
			}
			f(eventType, func, ops);
			events[eventType].splice(fIndex, 1);
		}
	}

}).call(Controller.prototype);
(function() {
	this.befores = [];
	this.afters = [];
	this.middle = function(data, view, controller) {
		if(view.latte["stop"]) {
			return;
		}
		for(var i = 0, l = view.childrens.length; i < l; i++) {
			(function(i, view) {
				var child = view.childrens[i];
				Controller.create(child, data);
			})(i, view);
		}
 	}
 	this.addBefore = function(func) {
 		if(latte_lib.isFunction(func)) {
 			this.befores.push(func);
 		}
 	}
 	this.addAfter = function(func) {
 		if(latte_lib.isFunction(func)) {
 			this.afters.push(func);
 		}
 	}
 	this.create = function(dom, data) {
 		if(dom.latteController) {
 			return dom.latteController;
 		}
 		data = LatteObject.create(data);
 		return new Controller(dom, data);
 	}
 	this.remove = function(dom, data, controller) {
 		if(!dom) {
 			return;
 		}
 		controller = controller || dom.latteController;
 		controller && controller.close();
 	}
 	this.removeChild = function(dom) {
 		for(var i = 0, len = dom.childrens.length; i < len; i++) {
 			Controller.remove(dom.childrens[i]);
 			dom.removeChild(dom.childrens[i]);
 		}
 	}
 	this.createChild = function(dom) {
 		for(var i = 0, len = dom.childrens.length ; i < len; i++) {
 			Controller.create(dom.childrens[i], data);
 		}
 	}
 	this.addCommand = function(func) {
 		Controller.addBefore(func.before);
 		Controller.addAfter(func.after || func);
 	}
}).call(Controller);
var funcs = latte.require.find("latte_view/controller/commands/").map(function(o) {
	var r = require("./commands/" + o);
	return r;
});
var befores = funcs.sort(function(a, b) {
	return (b.beforeLevel || b.level || 0) - (a.beforeLevel || a.level || 0);
});
befores.forEach(function(b) {
	if(b.before) {
		Controller.addBefore(b.before);
	}
});
var afters = funcs.sort(function(a, b) {
	return (b.afterLevel || b.level || 0) - (a.beforeLevel || a.level || 0);
});
afters.forEach(function(a) {
	if(a.after) {
		Controller.addAfter(a.after);
	}
});

module.exports = Controller;