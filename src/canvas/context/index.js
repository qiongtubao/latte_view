(function() {	
	var Board = require("./board");
	var Context = require("./context");
	this.createContext = function(dom) {
		dom = dom || {};
		var context = new Context(dom);
		return context;
	}
	this.createBoard = function(dom) {
		var board = new Board(dom) 
		return board;
	}
}).call(module.exports);	