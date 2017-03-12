(function() {
	/**
		var isBlank = function(str) {
			return str.replace(/\s/g, "") == "";
		}
		var getChild = function(datas, root) {
			if(datas.length == 0) {
				return [];
			}
			var tab = datas[0].tab;
			var nums = [];
			
			for(var i = 0,len = datas.length;i < len; i++ ) {
				if(datas[i].tab == tab) {
					nums.push(i);
				}else if(datas[i].tab < tab) {
					console.log(datas[i], datas[0]);
					throw new Error("latte format Error");
				}
			}
			var result = [];
			for(var i = 0, len = nums.length; i < len; i++) {
				if((i+1) ==len) {
					result.push(
						 datas.slice(nums[i] )
					)
				}else{
					result.push(datas.slice(nums[i] , nums[i+1]));
				}		
			}
			return result;
		}
	var getRoot = function(array) {
		var root = datas[0];
		root.childs = [];
		delete root.tab;
		delete root.all;
		var array = getChild(datas.slice(1), root);
		array.forEach(function(a) {
			var child = getRoot(a);
			root.childs.push(child);
		});
		return root;
	}
		var getNearblank = function(line) {
			return Utils.getNear(line, " ", "\t");
		}

	var line2Object = function(line) {
		var result = {};
		result.all = line;
		var tab = 0;
		for(var i = 0, len = line.length; i < len ; i++) {
			if(line[i] == " ") {
				tab++;
			}else if(line[i] == "\t") {
				tab += 4;
			}else{
				break;
			}
		}
		result.tab = tab;
		var line = line.trim();
		if(line[line.length -1] == "\"") {
			var endIndex = line.lastIndexOf("\"",line.length-2);
			result.text = line.substring(endIndex+1, line.length - 1);
			line = line.substring(0, endIndex);
		}
		
		var index = getNearblank(line);
		
		var data0 = line.substring(0, index);
		line = line.substring(index).trim();
		
		var index = data0.indexOf("#");
		var classStartIndex = data0.indexOf(".", index);
		var tag, id, tagEndIndex;
		if(index != -1) {
			//have id
			tag = data0.substring(0, index);
			
			if(classStartIndex != -1) {
				id = data0.substring(index, classStartIndex);
			}else{
				id = data0.substring(index);
			}
		};
		if(!tag) {
			if(classStartIndex != -1) {
				tag = data0.substring(0, classStartIndex);
			}else{
				tag = data0;
			}
		}
		var classs;
		if(classStartIndex != -1) {
			classs = data0.substring(classStartIndex).split(".");
			classs.shift();
		}else{
			classs = [];
		}

		result.tag = tag;
		if(id) {
			result.id = id;
		}
 		if(classs && classs.length > 0) {
 			result.classs = classs;
 		}	
			
		var attrs = {};
		var compileAttr = Utils.getJSON;
		var lattes = {};
		
 		if(line[0] == "[") {
			line = compileAttr(line, "[", "]", attrs);
			line = compileAttr(line,  "(", ")", lattes);
 		}else if(line[0] == "(") {
 			line = compileAttr(line,  "(", ")", lattes);
 			line = compileAttr(line,  "[", "]", attrs);
 		}
 		result.lattes = lattes;
		result.attrs = attrs;		
		return result;
	}
		var isBlank = function(line) {

		}
	this.toObject = function(str) {
		var datas = [];
		data.split("\n").forEach(function(line) {
			if(!isBlank(line)) {
				var object = line2Object(line);
				datas.push(object);
			}
		});
		return getRoot(datas);
	}
	*/

	

	var attrchar = {
		"}": "attribute",
		")": "latte",
		">": "style"
	};
	var attribute = {
		"attribute": "{",
		"latte": "(",
		"style": "<"
	}
	var getLast = function(line, attrs) {
		return attrs[line[line.length -1]];
	}
	var line2Object = function(line) {
		var result = {};
		result.all = line;
		var tab = 0;
		for(var i = 0, len = line.length; i < len ; i++) {
			if(line[i] == " ") {
				tab++;
			}else if(line[i] == "\t") {
				tab += 4;
			}else{
				break;
			}
		}
		result.tab = tab;
		var line = line.trim();
		if(line[line.length -1] == "\"") {
			var endIndex = line.lastIndexOf("\"",line.length-2);
			result.text = line.substring(endIndex+1, line.length - 1);
			line = line.substring(0, endIndex).trim();

		}
		
		var type;
		while(type = getLast(line,attrchar)) {
			var endIndex = line.lastIndexOf(attribute[type]);
			if(endIndex == -1) {
				break;
			}
			var o = line.substring(endIndex+1, line.length - 1);
			var kvs = o.split(",");
			var obj = {};
			kvs.forEach(function(kv) {
				var array = kv.split(":");
				if(array.length < 2) {
					return;
				}
				var k = array[0].trim();
				var c = array[1].trim();
				if(c[0] == "\"" || c== "'") {
					obj[k] = c.substring(1, c.length-1);
				}else{
					if(!isNaN(c - 0)) {
						obj[k] = c - 0;
					}else{
						obj[k] = c;
					}
					
				}
				
			});
			result[type] = obj;
			line = line.substring(0, endIndex).trim();
		}

		var classsArray = line.split(".");
		if(classsArray.length > 1) {
			result.glass = classsArray.slice(1);
			line = classsArray[0];
		} 
		var idArray = line.split("#");
		if(idArray.length > 1) {
			result.id = idArray[id.length-1];
			line = idArray[0];
		}
		result.tag = line.trim();
		result.childrens = [];
		return result;

	}
		var isBlank = function(str) {
			return str.replace(/\s/g, "") == "";
		}
		var findParent = function(last, tab) {
			if(last.tab < tab) {
				return last;
			}
			while(last.tab != tab) {
				last = last.parent;
			}
			if(last.tab == tab) {
				return last.parent;
			}
			return null;
		}
	this.toObject = function(str) {
		//var datas = [];
		var root ;
		var last;
		str.split("\n").forEach(function(line) {
			if(isBlank(line)) {
				return;
			}
			var object = line2Object(line);
			if(!root) {
				root = object;
				last = root;
				return;
			}
			
			var parent = findParent(last, object.tab) || root;

			object.parent = parent;
			parent.childrens.push(object);
			last = object;
			//datas.push(object);
		});
		console.log(root);
		return root;

	}
}).call(module.exports);