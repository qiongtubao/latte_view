(function() {
	var View = require("./view");
	var Lade = require("../lib/lade");
	var self = this;
	this.find = function() {

	}
	this.isDomView = function(o) {
		return  View.isView(o);
	}
	this.create = function(dom) {

		if(self.isDomView(dom)) {
			return dom;
		}
		if(Lade.isLade(dom)) {
			return View.ladeCreateDom(dom);
		}
		return View.create(dom);
	}

}).call(module.exports);