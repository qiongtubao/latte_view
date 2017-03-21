var Color = function() {

};
(function() {
	this.toString = function() {
		return this.rgb() + "";
	}
}).call(Color.prototype);
module.exports = {
	color: Color
};