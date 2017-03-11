var Loader = require("./loader");
var View = require("./view");
var Loade = require("./lade"); 
var latte_lib = require("latte_lib");
var Controller = require("./controller");
var LatteView = function(dom) {
	this.dom = dom;
	this.view = View.createContext();
	this.border = View.createBoard(dom);
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
	var isIn = function(event, latte) {
		var local = {x:0, y:0};
		var o = latte;
		while(o.parent) {
			local.x += o.status.x;
			local.y += o.status.y;
			if(o.position == "absolute") {
				break;
			}
			o = o.parent;
		}
		if(local.x < event.x && event.x < (local.x + latte.status.width) && local.y < event.y &&  event.y < (local.y + latte.status.height)) {
			return true;
		}
		return false;
	}
	var find = function(latte, event) {
		if(latte.childrens) {
			var o ;
			for(var i = latte.childrens.length -1; i >=0; i--) {
				var c = latte.childrens[i];
				var n = find(c, event);
				if(n) {
					return n;
				}
			}
		}

		if(isIn(event, latte) ) {
			console.log(latte, latte.status);
			return latte;
		}
		return null;
		 
		

	}
	this.findObject = function(event) {
		var sort = Object.keys(this.layers).sort(function() {
			return b > a;
		});
		var self = this;
		for(var i = 0, len = sort.length; i < len ; i++) {
			var layer = sort[i];
			var layers = this.layers[layer];
			for(var k = layers.length - 1; k >= 0; k--) {
				var c =layers[k];
				var m = find(c, event);
				if(m) {
					return m;
				}
			}
		}

	}
	this.addClickEvent = function() {
		var self = this;
		this.dom.addEventListener("click", function(event) {
			var e = {
				x: event.offsetX,
				y: event.offsetY
			};
			var result = self.findObject(e);
			console.log(result);
			e.object = result;
			var o = result;
			while(!event.stop && o.parent) {
				o.emit("click", event);
				o = o.parent;
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
				Controller.create(data, n.data);
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
	var getChild = function(root) {
		var result = [];
		if( !root.childrens || !root.childrens.length ) {
			return [root];
		}
		root.childrens.forEach(function(c) {
			result = result.concat(getChild(c));
		});
		return result;
	}

	this.draw = function() {
		var sort = Object.keys(this.layers).sort();
		var self = this;

		sort.forEach(function(key) {
			self.layers[key].forEach(function(c) {
				console.log(c);
				var object = self.view.draw(c);
				self.border.drawCache(c, {x: 0, y:0});
				//console.log(c);
			});
			
		});
		//setTimeout(function() {
		//	self.draw();
		//}, 1000);
	}

}).call(LatteView.prototype);
(function() {
	this.create = function(id) {
		var dom = document.getElementById(id);
		return new LatteView(dom);
	}
}).call(module.exports);