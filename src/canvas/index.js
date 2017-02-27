var Loader = require("./loader");
var Context = require("./context");
var Loade = require("./lade"); 
var LatteView = function(dom) {
	this.context = new Context(dom);
	this._context = new Context();
	this.width = dom.width;
	this.height = dom.height;
	this.loader = new Loader();
	this.root = Loade.create({
		type: "root",
		style: {
			width: width,
			height: height
		}
	});
};
(function() {
	this.route = function(object) {
		this._route = object;
		var self = this;
		//object.on("index", function(old, now) {

		//});
		if(object.index) {
			var n = object[object.index];
			this.loader.loadView(n.url, function(err, data) {
				self.root.removeAllChild();
				self.root.appendChild(data);
				self.controller(n.data);
			});
		}
	}
	this.draw = function() {

	}

}).call(LatteView.prototype);
(function() {
	this.create = function(id) {
		var dom = document.getElementById(id);
		return new LatteView(dom);
	}
}).call(module.exports);