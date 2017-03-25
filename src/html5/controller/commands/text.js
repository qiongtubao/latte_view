var  latte_lib = require("latte_lib")
		, LatteObject = latte_lib.object
		, lib = require("../../lib/index.js");
	/**
		<p>{{name}}</p>
		<p latte-value="{{name}}"></p>
		单项绑定
		data -> view
		缺点是使用insertHTML 修改的话不会改变
	*/
	var Command = {};
	(function() {
				var forEachJSON = function(data, key, result) {
					for(var i in data) {
						
						if(latte_lib.isObject(data[i])) {
							var ckey = latte_lib.clone(key);
							ckey.push(i);
							forEachJSON(data[i], ckey, result);
						}else if(latte_lib.isArray(data[i])){
							var ckey = latte_lib.clone(key);
							ckey.push(i);
							forEachJSON(data[i], ckey, result);
						}else{
							var ckey = latte_lib.clone(key);
							ckey.push(i);
							result[ckey.join(".")] = data[i] != null ?data[i].toString(): "undefined";
							

						}
					}
				}
			var toJSON = function(data) {
				var result = {};
				var json = data.toJSON();
				forEachJSON(json,  [], result);	
				
				return result;
			}
			var templateLanguage = function(template, options) {
				var data = template;
				var key2s = lib.stringRegExp(data, "!#", "#!");
				//for(var i in key2s) {
				key2s.forEach(function(i) {
					data = data.replace(new RegExp("!#"+i+"#!","igm"), options[i] || i);
				});
					
				//}
				
				return data;
			}
		this.after = function(data, view, controller) {

				var doChange = function(str) {
					var text = latte_lib.format.templateStringFormat(str, toJSON(data));
					text = templateLanguage(text, lib.language.toJSON());
					//如果有dom的话可能会修改掉dom  比如button  里面有span  会被覆盖掉   暂时没想到其他简单的解决方案
					
					var list = [];
					if(view.children.length) {
						
						var v ;
						while( v = view.children[0]) {
							list.push(v);
							view.removeChild(v);
						} 
					}
					view.text(text);
					if(list.length) {
						list.forEach(function(v) {
							view.appendChild(v);
						});
						
					}
				};
				var changeFunc = function(str) {
					//var keys = LatteObject.stringRegExp(str, "`{{", "}}`");
					var key1s = lib.stringRegExp(str, "{{", "}}");
					var key2s = lib.stringRegExp(str, "!#" , "#!" );
					doChange(str);
					key1s.forEach(function(key) {
						
						controller.bind("data", key, function(value, oldValue) {
							doChange(str);
						});
					});
					
					if(key2s.length) {
						lib.language.on("change", function(value, old) {
							doChange(str);
						});
					}

					//var keys = LatteObject.
					
				}
			var latteValue = view.latte("text");
			if(latteValue) {
				changeFunc(latteValue);
			}else if(view.childNodes.length == 1 && view.childNodes[0].nodeType == 3) {
				//text 转换成 latte-value
				view.latte("text", view.node().value);
				changeFunc(view.text());
			}
		}
	}).call(Command);
	
	module.exports = Command;