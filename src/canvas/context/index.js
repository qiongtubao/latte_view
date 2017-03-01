(function() {
	/**
	var Context = function(dom, config) {
		this.board = new Board(dom);
		this._dom = document.createElement("canvas");
		this._dom.width = 10000;
		this._dom.height = 10000;
		this._board = new Board(this._dom);
	};
	(function() {
		this.draw = function(lade) {	
			var tagHandle = require("./tags/" + lade.tag);
			if(!tagHandle) {
				throw new Error("type error")
			}
			tagHandle.draw(status, lade);
		}
		this.init = function(lade) {
			var tagHandle = require("./tags/" + lade.tag);
			if(!tagHandle) {
				throw new Error("type error")
			}
			tagHandle.init && tagHandle.init(lade);
		}
	}).call(Context.prototype);
	var Board = function(dom) {
		this.dom = dom;
		this.ctx = dom.getContext("2d");
		this.width = dom.width;
		this.height = dom.height;
	};
	(function() {

		this.drawImage = function(local, style, image) {
			this.ctx.beginPath();
			this.ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);

			this.ctx.closePath(style.imageX, style.imageY, style.imageWidth, style.imageHeight, local.x, local.y, style.width, style.height);
			return {
				x: local.x,
				y: local.y,
				width: style.width,
				height: style.height
			};
		}

		this.drawText = function(local, style, text) {
			this.ctx.beginPath();
			this.ctx.textAlign = "start" ;//start, end, left, right or center
			this.ctx.textBaseline = "alphabetic"; //top, hanging, middle, alphabetic, ideographic, bottom
			this.ctx.font = [style.fontSize || 10 + "px", style.font || "sans-serif"].join(" ");
  			this.ctx.direction = "inherit" ;//ltr, rtl, inherit
  			var metrics = context.measureText(text);
  			var width = metrics.width;
  			//this.ctx.fillText(text, 10, 50);
			this.ctx.fillText(text, local.x, local.y);
			this.ctx.closePath();
			return {
				x: local.x,
				y: local.y,
				width : width,
				height: style.fontSize + 1
			}
		}
		this.drawBox = function(local, style) {
			this.ctx.beginPath();
			this.ctx.fillStyle = (style.backgroundColor);
			this.ctx.strokeStyle = (style.borderColor);
			this.ctx.linewidth=style.borderWidth;
			this.ctx.fillRect(local.x , local.y, style.width , style.height);
			this.ctx.strokeRect(local.x, local.y, style.width, style.height);
			this.ctx.closePath();
			return {
				x: local.x,
				y: local.y,
				width : style.width, 
				height: style.height
			};
		} 
		this.getImage = function() {
			var image = this.dom.toDataURL("image/png").replace("image/png", "image/octet-stream");
			return image;
		}
		this.getImageData = function(x, y, width, height) {
			var imgData = this.ctx.getImageData(x, y, width, height);
			//have  data   prototype
			return imgData;
		}

	}).call(Board.prototype);
	*/
	var BoardCache = function() {

	};
	(function() {

	}).call(BoardCache.prototype);
	var Board = function(dom) {
		this.dom = dom;
		this.ctx = dom.getContext("2d");
	};
	(function() {
		this.drawCache = function(object, local) {
			this.drawImage({
				x: local.x,
				y: local.y
			},{
				imageX: 0,
				imageY: 0,
				imageWidth: object.cache.width,
				imageHeight: object.cache.height,
				width: object.cache.width,
				height: object.cache.height
			}, object.cache.Image);
			return object.cache;
		}
		this.drawImage = function(local, style, image) {
			this.ctx.beginPath();
			this.ctx.drawImage(img, style.imageX, style.imageY, style.imageWidth, style.imageHeight, local.x, local.y, style.width, style.height);
			this.ctx.closePath();
			return {
				x: local.x,
				y: local.y,
				width: style.width,
				height: style.height
			};
		}
		this.drawBox = function(local, style) {
			this.ctx.beginPath();
			this.ctx.fillStyle=style.backgroundColor;  //填充的颜色
			this.ctx.strokeStyle=style.borderColor;  //边框颜色
			this.ctx.linewidth=10;  //边框宽
			this.ctx.fillRect(0,0,style.width,style.height);  //填充颜色 x y坐标 宽 高
			this.ctx.strokeRect(0,0,style.width,style.height);  //填充边框 x y坐标 宽 高
			this.ctx.closePath();
			return {
				x: local.x,
				y: local.y,
				width: style.width,
				height: style.height
			}
		}
		var getTextWidth = function(text, width ,getWidth) {
			for(var i = text.length ; i > 0; i--) {
				var t = text.substring(0, i);
				if(getWidth(t).width < width ) {
					return t;
				}
			}
			return "";
		}
		this.drawTextMiddle = function(local, style, text) {
			this._drawText(style, function(getWidth, drawText) {
				var o = getWidth(text);
				if(style.width > o.width) {
					drawText(text, 
						local.x + (style.width - o.width )/2, 
						style.height < style.fontSize ? 0 : style.height - style.fontSize )/2);
				}else{
					var maxText = getTextWidth(text, style.width, getWidth);
					drawText(maxText, 
						local.x + (style.width - o.width )/2, 
						style.height < style.fontSize ? 0 : style.height - style.fontSize )/2);
				}
			});
		}
		
		this._drawText = function(style, verify) {
			this.ctx.beginPath();
			this.ctx.textAlign = "start" ;//start, end, left, right or center
			this.ctx.textBaseline = "alphabetic"; //top, hanging, middle, alphabetic, ideographic, bottom
			this.ctx.font = [Math.min(style.height  , style.fontSize ) || 10 + "px", style.font || "sans-serif"].join(" ");
  			this.ctx.direction = "inherit" ;//ltr, rtl, inherit
			this.ctx.measureText(text);
  			var result = verify(this.ctx.measureText, this.ctx.fillText)
			this.ctx.closePath();
			return result;
		}
	}).call(Board.prototype);
	var Context = function(config) {
		this._dom = document.createElement("canvas");
		this._dom.width = config.width || 10000;
		this._dom.height = config.height || 10000;
		this.board = new Board(this._dom);
	};
	(function() {
		this.draw = function(object) {
			if(object.cache) {
				return object.cache;
			}
			if(!object.children) {
				var tagHandle = require("./tags/"+object.tag);
				var cache = tagHandle.draw(this.board,  {x: 0, y:0}, object);
				cache.image = this._dom.toDataURL("image/png").replace("image/png", "image/octet-stream");
				tagHandle.cache = cache;
				return cache;
			}
			var offsetX = offsetY = 0;
			var maxWidth = maxHight = 0;
			object.children.forEach(function(c) {
				var cache = self.draw(c);
				if(c.style.position == "absolute") {
					return;
				}
				if(object.style.flex == "row") {
					offsetX += cache.width;
					maxHight = Math.max(maxHight, cache.height);
				}else{
					offsetY += cache.height;
					maxWidth = Math.max(maxWidth, cache.width);
				}
			});
			maxWidth = Math.max(maxWidth, offsetX);
			maxHight = Math.max(maxHight, offsetY);
			self.board.clean();
			var local = {
				x: 0,
				y: 0,
				offsetX: 0,
				offsetY: 0
			};
			object.children.forEach(function(c) {
				if(c.style.position = "absolute") {
					return;
				}
				var result = board.drawCache(c, local);
				if(object.style.flex == "row") {
					local.offsetX += cache.width;
				}else{
					local.offsetY += cache.height;
				}			
			});
			//var oImgData = this.board.getImageData(0, 0, maxWidth, maxHight);
			//this.board.putImageData(oImgData,0, 0);
			object.cache = {
				image: this._dom.toDataURL("image/png").replace("image/png", "image/octet-stream");
				x: 0,
				y: 0,
				width : maxWidth,
				height: maxHight 
			};
			return object.cache;
		}
		
	}).call(Context.prototype);
	this.createContext = function(dom) {
		var context = new Context(dom);
		return context;
	}
	this.createBoard = function() 
}).call(module.exports);	