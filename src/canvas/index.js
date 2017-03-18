var Loader = require("./loader");
var View = require("./view");
var Loade = require("./lade"); 
var latte_lib = require("latte_lib");
var Controller = require("./controller");
var Lcss = require("./lcss");
var LatteView = function(dom, lcss) {
	this.dom = dom;
	this.lcss = Lcss.create(this);
	this.view = View.createContext({
		width: 3000,
		height: 3000
	}, this.lcss);
	this.border = View.createBoard(dom, this.lcss);
	this.width = dom.width;
	this.height = dom.height;
	this.root = Loade.create({
		tag: "root",
		style: {
			width: this.width,
			height: this.height
		},
		latteView: this
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
		console.log(latte, local.x, local.y);
		if(local.x < event.x && event.x < (local.x + latte.status.width) && local.y < event.y &&  event.y < (local.y + latte.status.height)) {
			return true;
		}
		return false;
	}
	var findClick = function(latte, event) {
		if(latte.childrens) {
			var o ;
			for(var i = latte.childrens.length -1; i >=0; i--) {
				var c = latte.childrens[i];
				var n = findClick(c, event);
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
	this.findClickObject = function(event) {
		var sort = Object.keys(this.layers).sort(function() {
			return b > a;
		});
		var self = this;
		for(var i = 0, len = sort.length; i < len ; i++) {
			var layer = sort[i];
			var layers = this.layers[layer];
			for(var k = layers.length - 1; k >= 0; k--) {
				var c =layers[k];
				var m = findClick(c, event);
				if(m) {
					return m;
				}
			}
		}

	}
	this.addClickEvent = function() {
		var self = this;
		var clickStatus = null;
		this.dom.addEventListener("click", function(event) {
			var e = {
				x: event.offsetX,
				y: event.offsetY
			};
			var result = self.findClickObject(e);
			console.log(result);
			e.object = result;
			var o = result;
			while(!event.stop && o.parent) {
				o.emit("click", event);
				o = o.parent;
			}
		});
		this.dom.addEventListener("mousedown", function() {
			var e = {
				x: event.offsetX,
				y: event.offsetY
			};
			var result = self.findClickObject(e);
			e.object = result;
			var o = result;
			while(!event.stop && o.parent) {
				o.emit("mousedown", event);
				o = o.parent;
			}
			clickStatus = e;
		});
		this.dom.addEventListener("mousemove", function(event) {
			if(clickStatus) {
				var o = clickStatus.object;
				var event = {
					startX: clickStatus.x,
					startY: clickStatus.y,
					x: event.offsetX,
					y: event.offsetY,
					object: clickStatus.object
				};
				while(!event.stop && o.parent) {
					o.emit("mousemove", event);
					o = o.parent;
				}
			}
		});
		this.dom.addEventListener("mouseup", function(event) {
			var o = clickStatus.object;
			var event = {
				startX: clickStatus.x,
				startY: clickStatus.y,
				x: event.offsetX,
				y: event.offsetY,
				object: clickStatus.object
			};
			while(!event.stop && o.parent) {
				o.emit("mouseup", event);
				o = o.parent;
			}
			clickStatus = null;
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
				self.root.appendChild(data, this);
				Controller.create(data, n.data);
				if(n.lcss) {
					console.log(n.lcss, n, self.lcss)
					self.lcss.addFile(n.lcss);
				}
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
	this.initLayers = function() {
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
		if(!this.layers) {
			this.initLayers();
		}
		var sort = Object.keys(this.layers).sort();
		var self = this;

		sort.forEach(function(key) {
			self.layers[key].forEach(function(c) {
				var object = self.view.draw(c);
				self.border.drawCache(c, {x: 0, y:0});
				//console.log(c);
			});
			
		});
		//setTimeout(function() {
		//	self.draw();
		//}, 1000);
	}
	/**
	var findOne = function(latte, view, less) {
		var result  = [];
		if(latte.less.isIt(view, less)) {
			result.push(view);
			return result;
		}
		view.childrens.forEach(function(c) {
			result = result.concat(findOne(latte, c, less));
		});
		return result;
	}
	var find = function(latte, views, less) {
		var result = [];
		for(var i = 0, len = views.length ; i < len; i++) {
			var findResult = findOne(latte, views[i], less);
			if(findResult && findResult.length) {
				result = reuslt.concat(findResult);
			}
		}
		return result;
	}
	this.find = function(less) {
		var result = [this.root];
		for(var i = 0, len = less.selector.length; i < len; i++) {
			result = find(result, less.selector[i], less);
		}
		return find(result, less);
		
	}
	*/
	var findOne = function(latte, less, self) {
		var result  = [];
		console.log(self);
		if(self.lcss.isIt(latte, less)) {
			result.push(latte);
			return result;
		}
		latte.childrens.forEach(function(c) {
			result = result.concat(findOne(c, less, self));
		});
		return result;
	}
	var find = function(lattes, less, self) {
		var result = [];
		for(var i = 0, len = lattes.length ; i < len; i++) {
			result = result.concat(findOne(lattes[i], less, self));
		}
		return result;
	}
	this.find = function(less) {
		var result = [this.root];
		console.log(less);
		var self = this;
		for(var i = 0, len = less.selector.length; i < len; i++) {
			var array = [];
			find(result, less.selector[i], self).forEach(function(c) {
				array = array.concat(c.childrens);
			});
			result = array;
			
		}
		return find(result, less, self);
	}
}).call(LatteView.prototype);
(function() {
	this.create = function(id) {
		var dom = document.getElementById(id);
		return new LatteView(dom);
	}
}).call(module.exports);