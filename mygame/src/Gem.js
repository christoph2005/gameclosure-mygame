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
    
exports = Class(ui.ImageView, function (supr) {

	this.init = function (opts) {
		opts = merge(opts, {
         superview: this.view,
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
      this.view = new ui.ImageView({
         superview: this,
         image: blue_img,
         x:0,//-blue_img.getWidth(),
         y:0,//-blue_img.getHeight(),
         scale:1,
         width:blue_img.getWidth(),
         height:blue_img.getHeight(),
         zIndex: 0
      });
      
      this._animator = animate(this);
      
		//var sound = soundcontroller.getSound();
      this.setImage = bind(this,function(){
         this.view.setImage(green_img);
      });
      
      // Template for other move functions
      this.move = bind(this,function() {
         return this._animator.now({y: 400}, 200, animate.EASE_OUT);
      })
      
      // Move instantly
      this.moveTo = bind(this,function(x,y) {
         return this._animator.now({x: x-this.style.width/2, y: y-this.style.height/2}, 0, animate.linear);
      })
      
      // Move over time
      this.moveToFor = bind(this,function(x,y,t) {
         return this._animator.now({x: x-this.style.width/2, y: y-this.style.height/2}, t, animate.linear);
      })
      

	};
   
});