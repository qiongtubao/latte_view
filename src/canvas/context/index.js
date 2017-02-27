(function() {
	var Context = function(dom) {
		if (!dom) {
			dom = Document.create("canvas");
			dom.width = 1000;
			dom.height = 1000;
		}
		this.context = dom.getContext("2d");
		this.width = dom.width;
		this.height = dom.height;
	};
	(function() {
		this.drawImage = function(lade, child, parent) {

		}
		this.drawText = function(lade, child, parent) {

		}
		this.drawBox = function(lade, child, parent) {

		} 
		this.getImageArray = function() {

		}
	}).call(Context.prototype);
	this.create = function(dom) {
		var context = new Context(dom);
		return context;
	}
}).call(module.exports);	