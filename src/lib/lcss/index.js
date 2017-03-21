(function() {
	var Lcss = function(latte) {
		this.data = {};	
		this.files = {};
		this.glasss = {};
		this.ids = {};
		this.tags = {};
		this.all = []
		this.latte = latte;
	};
	(function() {
		this.addFile = function(file, lcss) {
			var self = this;
			if(this.files[file]) {
				return;
			}
			require("../loader").loadLcss(file, function(err, lcss) {
				if(err) {
					return;
				}
				self.add(lcss);
			});
			
		}
		this.add = function(array) {
			var self = this;
			var lades = [];
			array.forEach(function(o) {
				console.log("lcss....add  ", o);
				if(o.tag) {
					self.addTag(o.tag, o);
				}
				if(o.glass && o.glass.length) {
					self.addGlass(o.glass, o);
				}
				if(o.id) {
					self.addId(o.id, o);
				}
				self.all.push(o);
				var selectors = self.find(o);
				console.log("llllllllllllllll",selectors);
				lades = lades.concat(selectors);
			});
			console.log(lades);
			lades.forEach(function(lade) {
				var cache = self.query(lade);
				lade.style.setCache(cache);
				console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!", lade, cache);
			});
		}
		this.find = function(selector) {
			return this.latte.find(selector);
		}

		var isIt = this.isIt = function(latte, selector) {
			if(selector.id) {
				if(selector.id != latte.id) {
					return false;
				}
 			}
 			if(selector.tag) {
 				if(selector.tag != latte.tag) {
 					return false;
 				}
 			}
 			if(selector.glass && selector.glass.length) {
 				for(var len = selector.glass.length; i < len; i++) {
 					if(latte.glass.indexOf(selector.glass[i]) == -1) {
 						return false;
					}
				}
 			}
 			return true;
		}
		var isSelector = function(latte, selector) {
			var o = latte.parent;
			/**
			for(var i = selector.lengt-1; i >=0 ; i--) {
				if(isIt(o , selector[i])) {
					
				}
			}
			*/
			var i = selector.length - 1;
			while(o && i >=0 ) {
				if(isIt(o, selector[i])) {
					i--;
				}
				o = o.parent;
			} 
			console.log("waiting.....",latte, selector, i);
			if( !selector[i]) {
				return true;
			}
			return false;
		}
		this.query = function(latte) {
			var allpros = [];
			if(latte.tag) {
				var allTags = this.getTag(latte.tag);
				allTags.forEach(function(o) {
					if(isSelector(latte, o.selector) && allpros.indexOf(o) == -1) {
						allpros.push(o);
					}
				});
			}
			if(latte.glasss) {
				var allGlass = this.getGlass(latte.glass);
				allGlass.forEach(function(o) {
					if(isSelector(latte, o.selector) && allpros.indexOf(o) == -1) {
						allpros.push(o);
					}
				});
			}
			if(latte.id) {
				var allId = this.getId(latte.id);
				allId.forEach(function(o) {
					if(isSelector(latte, o.selector) && allpros.indexOf(o) == -1) {
						allpros.push(o);
					}
				});
			}
			var attr = latte_lib.merger.apply({}, [{}].concat(allpros.map(function(o) {
				return o.data;
			})));
			return attr;
		}
		this.addTag = function(tag, data) {
			this.tags[tag] = this.tags[tag] || [];
			this.tags[tag].push(data);	
		}
		this.addId = function(id, data) {
			this.ids[tag] = this.ids[tag] || [];
			this.ids[tag].push(data);
		}
		this.addGlass = function(glass, data) {
			glass.forEach(function(g) {
				self.glasss[g] = self.glasss[g] || [];
				self.glasss[g].push(data);
			});
		}	
		this.getTag = function(tag) {
			return this.tags[tag] || [];
		}
		this.getId = function(id) {
			return this.ids[id] || [];
		}
		this.getGlass = function(glass) {
			return this.glasss[glass] || [];
		}
	}).call(Lcss.prototype);
	this.create = function(latte) {
		return new Lcss(latte);
	}
	this.parse = require("./lcss").parse;
}).call(module.exports);