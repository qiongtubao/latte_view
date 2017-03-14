(function() {	
	var Board = require("./board");
	var Context = require("./context");
	this.createContext = function(dom , less) {
		dom = dom || {};
		var context = new Context(dom , less);
		return context;
	}
	this.createBoard = function(dom, less) {
		var board = new Board(dom, less) 
		return board;
	}
}).call(module.exports);	