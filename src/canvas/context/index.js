(function() {
	var Context = function(dom) {
		if (!dom) {
			dom = Document.create("canvas");
			dom.width = 1000;
			dom.height = 1000;
		}
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
			this.ctx.fillStyle(style.backgroundColor);
			this.ctx.strokeStyle(style.borderColor);
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
	}).call(Context.prototype);
	this.create = function(dom) {
		var context = new Context(dom);
		return context;
	}
}).call(module.exports);	