var Board = require("./board");
var Context = function(config, less) {
	this._dom = document.createElement("canvas");
	this.less = less;
	//document.body.appendChild(this._dom);
	this._dom.width = config.width || 1000;
	this._dom.height = config.height || 1000;
	this._dom.setAttribute("width", this._dom.width);
	this._dom.setAttribute("height", this._dom.height);
	this.board = new Board(this._dom);
};
(function() {
		var merger = function(obj, less) {
			var style = less.query(obj);
			var result =  {
				tag: obj.tag,
				style: latte_lib.merger(style, obj.style),
				childrens: obj.childrens,
				attribute: obj.attribute,
				text: obj.text
			};
			console.log(result);
			return result;
		}
	this.draw = function(object) {
		if(object.cache && object.cache.image) {
			return object.cache;
		}
		//计算长,宽
		object.childrens = object.childrens || [];
		var absolutes = []
		var offsetX, offsetY, maxWidth, maxHight;
	 	offsetX  =  offsetY = maxWidth = maxHight = 0;
	 	var self = this;
		object.childrens.forEach(function(c) {
			if(c.style.zIndex != null) {
				return;
			}
			var cache = self.draw(c);
			/**
			if(c.style.position == "absolute") {
				absolutes.push(c);
				return;	
			}
			if(object.style.flex == "row") {
				offsetX += (c.style.x || 0) + cache.width;
				maxHight = Math.max(maxHight, (c.style.y || 0 ) + cache.height);
			}else{
				offsetY += (c.style.y || 0) + cache.height;
				maxWidth = Math.max(maxWidth, (c.style.x || 0 ) + cache.width);
			}
			*/
			if(c.style.position == "absolute") {
				absolutes.push(c);
				return;	
			}
			if(object.style.flex == "row") {
				offsetX += (c.style.x || 0) + cache.width;
				maxHight = Math.max(maxHight, (c.style.y || 0 ) + cache.height);
			}else{
				offsetY += (c.style.y || 0) + cache.height;
				maxWidth = Math.max(maxWidth, (c.style.x || 0 ) + cache.width);
			}
		});

		var self = this;

		self.board.clean();
		var me = object;
		var tagHandle = require("./tags/"+object.tag);
		var cache = tagHandle.draw(this.board,  {x:  0 , y:  0, width: maxWidth, height: maxHight}, me);
		maxWidth = cache.width || Math.max(maxWidth, offsetX);
		maxHight = cache.height || Math.max(maxHight, offsetY);

		var local = {
			x: 0,
			y: 0,
			offsetX: 0,
			offsetY: 0
		};
		object.childrens.forEach(function(c) {
			var cache = c.cache;
			if( c.style.zIndex != null) {
				return;
			}
			if(c.style.position == "absolute") {
				return;	
			}
			console.log(c,local.x + local.offsetX, local.y + local.offsetY)
			var result = self.board.drawCache(c, {
				x: local.x + local.offsetX,
				y: local.y + local.offsetY
			});
			console.log(c.style.flex,c.style.flex == "row");
			if(object.style.flex == "row") {
				local.offsetX += result.width || 0 ;	
			}else{
				local.offsetY += result.height || 0;	
			}
			/**
			if(c.cache.position == "absolute") {
				return;
			}
			var result = self.board.drawCache(c, {
				x: local.x + local.offsetX,
				y: local.y + local.offsetY
			});
			
			if(object.style.flex == "row") {
				local.offsetX += result.width || 0 ;
			}else{
				local.offsetY += result.height || 0;
			}	
			*/		
		});
		absolutes.forEach(function(c) {
			return self.board.drawCache(c, {
				x:  0,
				y:  0
			});
		});
		console.log(cache.x, cache.y);
		object.cache = {
			x: me.style.x || 0,
			y: me.style.y || 0,
			width : maxWidth,
			height: maxHight,
			tag: object.tag
		};
		object.cache.image = this.getImage(object.cache)
		if(object.cache.width || object.cache.height) {
			object.cache.once = 1;
		}
		return object.cache;
	}
	this.getImage = function(config) {
		if(!config.width || !config.height) {
			return null;
		}
		//this.board.ctx.globalAlpha = style.opacity || 1;
		//var imageData = this.board.ctx.getImageData(config.x, config.y,config.width, config.height);
		var image = this.board.getImage(config);
		if(image.width != config.width || image.height != config.height) {
			console.log(image.width , config.width , image.height , config.height)
		}
		
		return image;
	}
	
}).call(Context.prototype);
module.exports = Context;