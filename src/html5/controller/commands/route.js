(function() {
	var Routes = {};
	var latte_lib = require("latte_lib");
	var cache = {};
	var Loader = require("latte_view/lib/loader");
	this.before = function(data, dom, controller) {
		var Controller = require("../index.js");
		var ViewDom = require("../../view");
		var dataName = dom.latte("route");
		//var dom = dom.node();
		if(dataName) {
			var change = function(value, oldValue) {
				var d = data.get(value);
				if(d) {
					Loader.loadView(d.get("url"), function(err, latte) {
						if(err) {
							throw new Error("load error");
						}
						var html = ViewDom.create(latte);
						if(oldValue) {
							var oldD = data.get(oldValue);
							oldD.get("end") && oldD.get("end").call(oldD);
						}
						Controller.removeChild(dom);

						dom.appendChild(html);
						console.log(dom, html);
						Controller.createChild(dom, d.get("data"));
						d.on("data", function(value, oldValue) {
							Controller.removeChild(dom);
							Controller.createChild(dom, value);
						});
						d.get("start") && d.get("start").call(d);
					});
				}else{
					throw new Error("no route");
				}
			}
			data.on(dataName, change);
			change(data.get(dataName));
		}
	}
}).call(module.exports);