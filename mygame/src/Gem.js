import animate;
import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;
//import src.soundcontroller as soundcontroller;

var blue_img = new Image({url: "resources/images/bubbles/bubbles/ball_blue.png"}),
	 green_img = new Image({url: "resources/images/bubbles/bubbles/ball_green.png"}),
	 purple_img = new Image({url: "resources/images/bubbles/bubbles/ball_purple.png"}),
	 red_img = new Image({url: "resources/images/bubbles/bubbles/ball_red.png"}),
	 yellow_img = new Image({url: "resources/images/bubbles/bubbles/ball_yellow.png"});
    
exports = Class(ui.View, function (supr) {

	this.init = function (opts) {
		opts = merge(opts, {
			width:	blue_img.getWidth(),
			height: blue_img.getHeight()
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	/*
	 * Layout
	 */
	this.build = function () {
      var w = blue_img.getWidth(),
          h = blue_img.getHeight(),
          sx = 0-w,
          sy = 0-h;
		var blue = new ui.ImageView({
			superview: this,
			image: blue_img,
			x: sx,
			y: sy,
         scale:1,
			width: w,
			height: h
		});
		var green = new ui.ImageView({
			superview: this,
			image: green_img,
			x: sx,
			y: sy,
         scale:1,
			width: w,
			height: h
		});
      console.log(green);
		//var sound = soundcontroller.getSound();

	};
});