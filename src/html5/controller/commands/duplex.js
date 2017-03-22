var LatteObject = require("latte_lib").object;
	var Command = {};
	(function() {
		var changeTags = ["input", "select", "textarea"];
		this.after = function(data, dom, controller) {
			var duplex = dom.attr("latte-duplex");
			if(duplex) {
				var latteObject = LatteObject.create(data);
				var changeDomFunc;
				if(changeTags.indexOf(dom.node().tagName.toLowerCase()) != -1) {
					var domChange = function(value) {
						if(controller.closed) {
							return controller.unbind("view", "change", domChange);
						}
						data.set(duplex,  dom.value);
					}
					controller.bind("view", "change", domChange);
					changeDomFunc = function(value) {
						dom.value = value;
					};
				}else{
					dom.attr("contenteditable", "true");
					controller.bind("view", "keyup", function(event) {
						//console.log(dom.text(), data.get(duplex), duplex);
						if(dom.text() != data.get(duplex)) {
							data.set(duplex, dom.text());
						}
					});
					changeDomFunc = dom.text.bind(dom);
				}
				//console.log(dom.node().tagName);
				//controller.bind("view","change", domChange);
				
				var duplexChange = function(value) {
					if(self.closed) {
						return controller.unbind("data",duplex, duplexChange);
					}
					if( value == undefined ) {
						changeDomFunc("") ;
					} else{
						changeDomFunc(value);
					}
				}
				controller.bind("data", duplex, duplexChange);
				if( data.get(duplex) == undefined ) {
					changeDomFunc("") ;
				} else{
					changeDomFunc(data.get(duplex))  ;
				}
				
			}
			
		};
	}).call(Command);
	
	module.exports = Command;