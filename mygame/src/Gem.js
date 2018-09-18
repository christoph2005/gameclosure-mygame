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
		var blue = new ui.ImageView({
			superview: this,
			image: blue_img,
			x: 0,
			y: 0,
			width: blue_img.getWidth(),
			height: blue_img.getHeight()
		});


		//var sound = soundcontroller.getSound();

	};
});