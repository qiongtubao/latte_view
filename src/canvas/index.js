var Loader = require("./loader");
var Context = require("./context");
var Loade = require("./lade"); 
var latte_lib = require("latte_lib");
var LatteView = function(dom) {
	this.dom = dom;
	this.context = Context.createContext();
	this.border = Context.createBoard(dom);
	this.width = dom.width;
	this.height = dom.height;
	
	this.root = Loade.create({
		tag: "root",
		style: {
			width: this.width,
			height: this.height
		}
	});
	this.addClickEvent();
};
latte_lib.extends(LatteView, latte_lib.events);
(function() {
	this.findObject = function(point) {

	}
	this.addClickEvent = function() {
		var self = this;
		this.dom.addEventListener("click", function(event) {
			var e = {}
			var result = self.findObject(e);
			for(var i = 0, len = result.length; i < len; i++) {
				var paths = getPaths(result[i]);
				for(var i = 0, len = paths.length; i < len; i++) {
					if(e.stop) { break; }
					paths.emit("click", e);
				}
			}
		});
	}
	this.route = function(object) {
		this._route = object;
		var self = this;
		//object.on("index", function(old, now) {

		//});
		if(object.index) {
			var n = object[object.index];
			Loader.loadView(n.url, function(err, data) {
				if(err) {  console.log(err);return ;}
				self.root.removeAllChild();
				self.root.appendChild(data);
				self.initRoot();
				self.draw();
			});
		}
	}
		this._init = function(lade, layers, zIndex) {
			//this.context.init(lade);
			if(lade.style.zIndex != zIndex) {
				layers[lade.style.zIndex] = layers[lade.style.zIndex] || [];
				layers[lade.style.zIndex].push(lade);
				zIndex = lade.style.zIndex

			}
			var self = this;
			if(lade.childrens) {
				lade.childrens.forEach(function(c) {
					self._init(c, layers, zIndex);
				});
			}
		}
	this.initRoot = function() {
		this.layers = {};
		this.layers[0] = [this.root];
		this._init(this.root, this.layers);
	}
	
	this.draw = function() {
		var sort = Object.keys(this.layers).sort();
		var self = this;

		sort.forEach(function(key) {
			self.layers[key].forEach(function(c) {
				console.log(c);
				var object = self.context.draw(c);
				self.border.drawCache(c, {x: 0, y:0});
				//console.log(c);
			});
			
		});
		//console.log(self.root);
		//self.border.drawCache(this.root.childrens[0].childrens[0], {x: 0, y:0});
		//self.border.drawCache(this.root.childrens[0], {x: 0, y:0});
		console.log(this.root);
		//this.context.draw(this.root);
	}

}).call(LatteView.prototype);
(function() {
	this.create = function(id) {
		var dom = document.getElementById(id);
		return new LatteView(dom);
	}
}).call(module.exports);