
	var Loader = require("../lib/loader")
		, DomView = require("./view")
		, Controller = require("./controller");
	var LatteView = function(dom) {
		this.dom = DomView.create(dom);
	};
	(function() {
		this.route = function(route) {
			this.dom.latte("route", "index");
			LatteView.define(this.dom, route);
		}

	}).call(LatteView.prototype);
	(function() {
		this.create = function(id) {
			var dom = document.getElementById(id);
			return new LatteView(dom);
		}
		/**
			@method define
			@static
			@param:
				id <String> or DomView
				data <LatteObject>
		*/
		this.define = function(id, data) {
			var doms;
			if(DomView.isDomView(id)){
				doms = [id];
			}else{
				doms = DomView.find(id)
			}
			
			var controllers = [];
			if(doms) {
				
				for(var i = 0, len = doms.length; i < len; i++) {
					var dom = doms[i];
					var controller = Controller.create(dom, data);
					controllers.push(controller);
				}
			}
			return controllers;
		}
	}).call(LatteView);
	module.exports = LatteView;
