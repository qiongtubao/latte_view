var Loader = require("./loader");
var Context = require("./context");
var Loade = require("./lade"); 
var LatteView = function(dom) {
	this.context = Context.createContext();
	this.border = Context.createBoard(dom);
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
			//this.context.init(lade);
			if(lade.style.zIndex) {
				layers[lade.style.zIndex] = layers[lade.style.zIndex] || [];
				layers[lade.style.zIndex].push(lade);

			}
			var self = this;
			if(lade.childrens) {
				lade.childrens.forEach(function(c) {
					self._init(c, layers);
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
				var object = self.context.draw(c);
				self.border.drawCache(c, {x: 0, y:0});
				//console.log(c);
			});
			
		});
		//self.border.drawCache(this.root.childrens[0], {x: 0, y:0});
		//this.context.draw(this.root);
	}

}).call(LatteView.prototype);
(function() {
	this.create = function(id) {
		var dom = document.getElementById(id);
		return new LatteView(dom);
	}
}).call(module.exports);