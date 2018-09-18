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
      var that = this;
      function gem(color){
         var w = blue_img.getWidth(),
             h = blue_img.getHeight(),
             sx = 0-w,  
             sy = 0-h;
             var img;
             if (color == 'blue'){
               img = blue_img;
             } else if (color == 'green'){
               img = green_img;
             } else if (color == 'purple'){
               img = purple_img;
             } else if (color == 'red'){
               img = red_img;
             } else {
               img = yellow_img;
             } 
         return new ui.ImageView({
            superview: this.view,
            image: img,
            x: 0-sx,
            y: 600-sy,
            scale:1,
            width: w,
            height: h
         });
      }
		var blue = new gem('blue');
      this.addSubview(blue);
      blue.style.x = blue.style.x+500;
      console.log(blue);
		//var sound = soundcontroller.getSound();

	};
});