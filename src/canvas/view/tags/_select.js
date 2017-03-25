(function() {
	var defaultStyle = {

	};
	this.draw = function(ctx, local, object) {
		var style = object.style.mergerDefault(defaultStyle);
		var result =ctx.drawBox(local, style);
		ctx.drawTextMiddle(local, style, object.value || object.childrens[0].length - 1);
	}
	this.init = function(ctx, obj) {
		if(!obj.inited) {
			var latte = new Latte({
				tag: "latte",
				style: {
					zIndex: (obj.style.zIndex || 0)+ 1,
					display: "none",
					width: 50,
					height: 100
				},
				childrens: [],
				latte: {},
				attribute: {}
			});	
			obj.select = function(o) {
				var old = obj.select;
				if(old) {
					obj.select.attribute["selected"] = 0;
				}
				obj.select = o;
				o.attribute["selected"] = 1;
				obj.text = o.attribute.key;
				obj.value = o.attribute.value;
				obj.deleteCache();
				obj.emit("select", o, old);
			}
			
			obj.appendChild = function(o) {
				latte.appendChild(o);
			}
			obj.removeChild = function(o) {
				latte.removeChild(o);
			}
			this.childrens.forEach(function(o) {
				var cache = ctx.draw(o);
				obj.removeChild(o);
				latte.appendChild(o);
				obj.appendChild(latte);
				o.on("click", function() {
					obj.select(o);
				});
				if(o.attribute["selected"]) {
					obj.emit("select", o);
				}
			});
			obj.inited = 1;
		}
	}
}).call(module.exports);