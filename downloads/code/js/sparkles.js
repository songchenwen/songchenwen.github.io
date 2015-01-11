var Spark = function () {
    var a = this;;
    this.n = document.createElement("div");
    this.caculateStyle().newSpeed().newPoint().
		display().newPoint().fly()
};
Spark.prototype.display = function () {
    $(this.n).attr("style", this.style).
		css("position", "absolute").css("z-index", -1).
			css("top", this.pointY).
				css("left", this.pointX);
    $('#background').append(this.n);
    return this
};
Spark.prototype.caculateStyle= function(){
	var size = this.random(18) + 2;
	var alpha = 0.2 + 0.8 * 2/size;
	var shadowAlpha = alpha*2;
	this.style = "border-radius: 50%;";
	this.style = this.style	+ "width:" + size + 
		"px;height:" + size + "px;";
	this.style = this.style + "box-shadow:0 0 " + 
		size+"px rgba(255,255,255,"+ shadowAlpha +");";
	this.style = this.style + "background-color:" + 
		"rgba(255,255,255,"+ alpha +");";
	return this;
}
Spark.prototype.fly = function () {
    var a = this;
    $(this.n).animate({
        top: this.pointY,
        left: this.pointX
    }, this.speed, "linear", function () {
        a.newSpeed().newPoint().fly()
    })
};
Spark.prototype.newSpeed = function () {
    this.speed = (this.random(10) + 5) * 1100;
    return this
};
Spark.prototype.newPoint = function () {
    this.pointX = this.random(window.innerWidth - 100) + 50;
    this.pointY = this.random(window.innerHeight - 100) + 50;
    return this
};
Spark.prototype.random = function (a) {
    return Math.ceil(Math.random() * a) - 1
};
$(function () {
    if ($.browser.msie && $.browser.version < 9) {
        return
    }
    var a = 20;
    var b = [];
    for (i = 0; i < a; i++) {
        b[i] = new Spark()
    }
});