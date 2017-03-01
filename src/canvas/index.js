var Loader = require("./loader");
var Context = require("./context");
var Loade = require("./lade"); 
var LatteView = function(dom) {
	this.context = Context.createContext();
	this.border = Context.createBorder(dom);
	this.width = dom.width;
	this.height = dom.height;
	this.loader = Loader.create();
	this.root = Loade.create({
		tag: "root",
		style: {
			width: this.width,
			height: this.height
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
				if(err) {  console.log(err);return ;}
				self.root.removeAllChild();
				self.root.appendChild(data);
				self.initRoot();
				self.draw();
			});
		}
	}
		this._init = function(lade, layers) {
			this.context.init(lade);
			if(lade.style.zIndex) {
				layers[lade.style.zIndex] = layers[lade.style.zIndex] || [];
				layers[lade.style.zIndex].push(lade);

			}
			var self = this;
			if(lade.childrens) {
				lade.childrens.forEach(function(c) {
					self.layer(c, layers);
				});
			}
		}
	this.initRoot = function() {
		this.layers = {};
		this.layers[0] = [this.root];
		this._init(this.root, this.layers);
	}
	this.layer = function() {
		this.layers = {};
		this.root.childrens.forEach(function(c) {

		})
	}
	this.draw = function() {
		this.layout();
		this.context.draw(this.root);
	}

}).call(LatteView.prototype);
(function() {
	this.create = function(id) {
		var dom = document.getElementById(id);
		return new LatteView(dom);
	}
}).call(module.exports);