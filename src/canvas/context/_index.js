(function() {	
	var Board = function(dom) {
		this.dom = dom;
		this.ctx = dom.getContext("2d");
	};
	(function() {
		this.deleteCache = function(object) {
			var o = object;
			while(o) {
				delete o.cache;
				o = o.parent;
			}
		}
		this.drawCache = function(object, local) {
			if(!object.cache.image) {
				var cache = object.cache;
				delete object.cache;
				return {
					width: cache.width,
					height: cache.height
				};
			}
			this.save();
			this.ctx.beginPath();
			//this.ctx.globalAlpha = object.cache.opacity || 1;
			this.ctx.putImageData(object.cache.image.data, local.x, local.y);
			this.ctx.closePath();
			this.restore();
			if(object.cache.once) {
				var cache = object.cache;
				this.deleteCache(object);
				return cache;
			}
			return object.cache;
		}
		this.drawImage = function(local, style, image) {
			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.globalAlpha = style.opacity || 1;
			this.ctx.drawImage(image, style.imageX, style.imageY, style.imageWidth, style.imageHeight, local.x, local.y, style.width, style.height);
			this.ctx.closePath();
			this.ctx.restore();
			return {
				x: local.x,
				y: local.y,
				width: style.width,
				height: style.height,
				opacity: style.opacity || 1
			};
		}
		this.drawBox = function(local, style) {
			this.ctx.save();
			this.ctx.beginPath();
			//this.ctx.globalAlpha = style.opacity || 1;
			style.opacity = style.opacity || 1;
			
			if(style.opacity != 1) {
				//var imageData = this.ctx.getImageData(local.x + (style.x || 0),local.y + (style.y || 0), style.width, style.height);
				//this.ctx.globalAlpha = style.opacity || 1;
				//this.ctx.putImageData(imageData, local.x + (style.x || 0),local.y + (style.y || 0) );
				
				
				console.log(local, style, local.x + (style.x || 0),local.y + (style.y || 0), style.width, style.height);
				var imageData = this.ctx.getImageData(local.x + (style.x || 0),local.y + (style.y || 0), style.width, style.height);
				var pixels = imageData.data;
				for(var i = 0 ,len = pixels.length / 4;i < len ; i += 4) {
					pixels[i + 3] = style.opacity || 0;
				}
				
				this.ctx.putImageData(imageData, local.x + (style.x || 0),local.y + (style.y || 0) );
				
			}else{
				this.ctx.fillStyle=style.backgroundColor;  //填充的颜色
				this.ctx.strokeStyle=style.borderColor;  //边框颜色
				this.ctx.linewidth=1;  //边框宽
				this.ctx.fillRect(local.x + (style.x || 0),local.y + (style.y || 0),style.width,style.height);  //填充颜色 x y坐标 宽 高
				//this.ctx.strokeRect(0,0,style.width,style.height);  //填充边框 x y坐标 宽 高
			}
			
			this.ctx.closePath();
			
			return {
				x: local.x,
				y: local.y,
				width: style.width,
				height: style.height,
				opacity: style.opacity || 1
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
		this.clean = function() {
			this.ctx.clearRect(0, 0, this.dom.width, this.dom.height);
		}
		this.drawTextMiddle = function(local, style, text) {
			return this._drawText(style, function(getWidth, drawText) {
				var o = getWidth(text);
				if(style.width > o.width) {
					drawText(text, 
						local.x + (style.width - o.width )/2, 
						style.height < style.fontSize ? 0 : (style.height - style.fontSize )/2);
				}else{
					var maxText = getTextWidth(text, style.width, getWidth);
					drawText(maxText, 
						local.x + (style.width - o.width )/2, 
						style.height < style.fontSize ? 0 : (style.height - style.fontSize )/2);
				}
				return {
					width: style.width,
					height: style.height,
					opacity: style.opacity || 1
				};
			});
		}
		this.drawText = function(local, style, text) {
			return this._drawText(style, function(getWidth,drawText) {
				
				 drawText(text, local.x, local.y, style.width);
				 var o = getWidth(text);
				 return {
				 	width: style.width || o.width,
				 	height: style.height || style.fontSize + 2,
				 	opacity: style.opacity || 1
				 }
			});
		}
		
		this._drawText = function(style, verify) {
			this.ctx.beginPath();
			//this.ctx.globalAlpha = style.opacity || 1;
			//this.ctx.textAlign = "start" ;//start, end, left, right or center
			//this.ctx.textBaseline = "alphabetic"; //top, hanging, middle, alphabetic, ideographic, bottom
			this.ctx.font = [Math.min(style.height  , style.fontSize ) + "px"|| 10 + "px", style.font || "sans-serif"].join(" ");
  			//console.log([Math.min(style.height  , style.fontSize ) || 10 + "px", style.font || "sans-serif"].join(" "));
  			//this.ctx.font = "12px serif";
  			//this.ctx.direction = "inherit" ;//ltr, rtl, inherit
  			this.ctx.textBaseline = "top";
			//this.ctx.font = "15px verdana";
			this.ctx.fillStyle = "#000000";
			//this.ctx.fillText("aaaaa", 0, 0);
  			var result = verify(this.ctx.measureText.bind(this.ctx), this.ctx.fillText.bind(this.ctx));
			
			this.ctx.closePath();
			return result;
		}
	}).call(Board.prototype);
	var Context = function(config) {
		this._dom = document.createElement("canvas");
		//document.body.appendChild(this._dom);
		this._dom.width = config.width || 1000;
		this._dom.height = config.height || 1000;
		this._dom.setAttribute("width", this._dom.width);
		this._dom.setAttribute("height", this._dom.height);
		this.board = new Board(this._dom);
	};
	(function() {
		this.getImage = function(config) {
			if(!config.width || !config.height) {
				return null;
			}
			//this.board.ctx.globalAlpha = style.opacity || 1;
			var imageData = this.board.ctx.getImageData(config.x, config.y,config.width, config.height);
			var d = imageData.data;
			
			var image = {
				data: imageData,
				width: config.width,
				height: config.height
			};
			return image;
		}
		/**
			现在无法获得parent 的背景
			因为在画之前无法确定大小
		*/
		this.draw = function(object) {
			if(object.cache && object.cache.image) {
				return object.cache;
			}

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
				if(c.style.position == "absolute") {
					absolutes.push(c);
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
			var self = this;
			self.board.clean();
			var tagHandle = require("./tags/"+object.tag);
			var cache = tagHandle.draw(this.board,  {x: 0, y:0, width: maxWidth, height: maxHight}, object);
			maxWidth = cache.width || Math.max(maxWidth, offsetX);
			maxHight = cache.height || Math.max(maxHight, offsetY);
			
			var local = {
				x: 0,
				y: 0,
				offsetX: 0,
				offsetY: 0
			};
			object.childrens.forEach(function(c) {
				if( c.style.zIndex != null) {
					return;
				}
				if(c.style.position == "absolute") {
					return self.board.drawCache(c, {
						x: c.style.x || 0,
						y: c.style.y || 0
					});
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
			});
			//var oImgData = this.board.getImageData(0, 0, maxWidth, maxHight);
			//this.board.putImageData(oImgData,0, 0);
			
			object.cache = {
				x: object.style.x || 0,
				y: object.style.y || 0,
				width : maxWidth,
				height: maxHight,
				opacity: cache.opacity || 1,
				tag: object.tag
			};
			object.cache.image = this.getImage(object.cache)
			if(object.cache.width || object.cache.height) {
				object.cache.once = 1;
			}
			return object.cache;
		}
		
	}).call(Context.prototype);
	this.createContext = function(dom) {
		dom = dom || {};
		var context = new Context(dom);
		return context;
	}
	this.createBoard = function(dom) {
		var board = new Board(dom) 
		return board;
	}
}).call(module.exports);	