(function() {
	var selector2Obj = function(k) {
		var result = {};
		var classsArray = k.split(".");
		if(classsArray.length > 1) {
			result.glass = classsArray.slice(1);
			k = classsArray[0];
		} 
		var idArray = k.split("#");
		if(idArray.length > 1) {
			result.id = idArray[idArray.length-1];
			k = idArray[0];
		}
		if(k.length != 0) {
			result.tag = k;
		}
		return result;
	}
	var block2Object = function(str) {
		str.trim();
		
		var index = str.indexOf("{");
		var k = str.substring(0, index).trim();
		var ks = k.split(" ");
		var lastk = ks[ks.length - 1];
		var result = selector2Obj(lastk);
		var selectors = [];
		for(var i = 0, len = ks.length -1; i < len ;i ++) {
			selectors.push(selector2Obj(ks[i].trim()));
		}
		result.selector = selectors;
		
		var v = str.substring(index + 1, str.length -1);
		var kvs = v.split(",");
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
		result.data = obj;
		return result;

	}
	var getBlockLastIndex = function(str) {
		var index = str.indexOf("}");
		if(index == -1) {
			return 0;
		}
		var num = findNum(str, index, /{/ig);
		if(num == 0) {
			return 0 ;
		}
		var wnum = num;
		while(wnum) {
			index = str.indexOf("}", index);
			if(index == -1) {
				return 0;
			}
			wnum--;
		}
		return index;
	}
	var findNum = function(str, index, reg) {
		var s = str.substring(0, index);
		if(reg.test(s)) {
			return s.match(reg).length;
		}
		return 0;
	}
	this.parse = function(str) {
		var blockIndex;
		var array = [];
		while(blockIndex = getBlockLastIndex(str)) {
			var blockStr = str.substring(0, blockIndex+1);
			str = str.substring(blockIndex + 1);
			var o = block2Object(blockStr);
			array.push(o);
		}
		return array;
	}
}).call(module.exports);