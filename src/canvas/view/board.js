var Board = function(dom) {
	this.dom = dom;
	this.ctx = dom.getContext("2d");
	this._dom = document.createElement("canvas");
	this._ctx = this._dom.getContext("2d");
};
(function() {
	this.deleteCache = function(object) {
		var o = object;
		while(o) {
			delete o.cache;
			o = o.parent;
		}
	}
	/**
		绘制缓存数据
		暂时用image对象
	*/
	this.drawCache = function(object, local) {
		if(object.tag == "animation") {
			console.log(object, local);
		}
		object.status = {
			position : object.style.position,
			x:  local.x + (object.style.x || 0),
			y: local.y + (object.style.y || 0),
			width : object.cache.width,
			height : object.cache.height
		}
		if(!object.cache.image) {
			var cache = object.cache;
			delete object.cache;

			return {
				width: cache.width,
				height: cache.height
			};
		}
		this.ctx.save();
		this.ctx.beginPath();
		//图片缓存
		//this.ctx.putImageData(object.cache.image.data, local.x, local.y);
		this.ctx.drawImage(object.cache.image, 0, 0, 
				object.cache.width, object.cache.height, local.x + (object.style.x || 0), local.y + (object.style.y || 0), 
				object.style.width || object.cache.width, object.style.height || object.cache.height);
		//this.ctx.drawImage(object.cache.image, local.x, local.y);
		this.ctx.closePath();
		this.ctx.restore();
		if(object.cache.once) {
			var cache = object.cache;
			this.deleteCache(object);
			return cache;
		}
		return object.cache;
	}
	/**
		绘制图片
		opacity 透明度
		imageX  图片中x位置
		imageY  图片中y位置
		imageWidth  图片宽
		imageHeight 图片高

	*/
	this.drawImage = function(local, style, image) {
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.globalAlpha = style.opacity || 1;
		this.ctx.drawImage(image, style.imageX, style.imageY, style.imageWidth, style.imageHeight, local.x, local.y, style.width, style.height);
		this.ctx.closePath();
		this.ctx.restore();
		return {
			x: local.x + (style.x || 0),
			y: local.y + (style.y || 0),
			width: style.width,
			height: style.height,
			opacity: style.opacity || 1
		};
	}

	this.drawBox = function(local, style) {
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.globalAlpha = style.opacity || 1;
		this.ctx.fillStyle = style.backgroundColor;  //填充的颜色
		this.ctx.strokeStyle = style.borderColor;  //边框颜色
		//this.ctx.linewidth=1;  //边框宽
		this.ctx.fillRect(local.x + (style.x || 0),local.y + (style.y || 0),style.width,style.height);  //填充颜色 x y坐标 宽 高
		//this.ctx.strokeRect(0,0,style.width,style.height);  //填充边框 x y坐标 宽 高
		this.ctx.closePath();
		this.ctx.restore();
		return {
			x: local.x + (style.x || 0),
			y: local.y + (style.y || 0),
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
		this.clean = function(width, height) {
			this.ctx.clearRect(0, 0, this.dom.width, this.dom.height);
			if(width && height) {
				//调整大小
				console.log("调整大小", width, height);
				this.dom.width = width;
				this.dom.height = height;
			}
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
					x: local.x + (style.x || 0),
					y: local.y + (style.y || 0),
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
				 	x: local.x + (style.x || 0),
					y: local.y + (style.y || 0),
				 	width: style.width || o.width,
				 	height: style.height || style.fontSize + 2,
				 	opacity: style.opacity || 1
				 }
			});
		}
		
		this._drawText = function(style, verify) {
			this.ctx.save();
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
			this.ctx.restore();
			return result;
		}
		this.getImage = function(config) {
			var width = config.width;
			var height =  config.height;
			var lineWidth = config.lineWidth;
			this._dom.width = width;
			this._dom.height = height;
			console.log(config);
			var image = this.ctx.getImageData(config.x,config.y,width, height);
			this._ctx.putImageData(image, 0,0);
			var src = this._dom.toDataURL();
			var image = new Image();
			image.src = src;
			if(image.width != width || image.height != height) {
				console.log("error",image.width, width,image.height , height);
			}
			return image;
		}
}).call(Board.prototype);
module.exports = Board;