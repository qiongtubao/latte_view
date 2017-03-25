(function() {
	this.after = function(data, dom, controller) {
		var showValue = dom.latte("show");

		if(showValue) {
			var doChange = function(v) {
				if(v) {
					dom.style("display", "");
				}else{
					dom.style("display", "none");
				}
			};
			controller.bind("data", showValue, function(value, oldValue) {
				doChange(value);
			});
			doChange(data.get(showValue));
		}
	}
}).call(module.exports);