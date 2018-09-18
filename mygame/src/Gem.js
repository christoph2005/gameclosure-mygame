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
		this.gemView = new gem('blue');
      this._animator = animate(this.gemView);
      this.addSubview(this.gemView);
      /*
      this.blue.style.x = this.blue.style.x+500;
      console.log(this.blue);
      */
     
		//var sound = soundcontroller.getSound();
      
      // Template for other move functions
      this.move = bind(this,function() {
         return this._animator.now({y: 400}, 200, animate.EASE_OUT);
      })
      
      // Move instantly
      this.moveTo = bind(this,function(x,y) {
         return this._animator.now({x: x, y: y}, 0, animate.linear);
      })
      
      // Move over time
      this.moveToFor = bind(this,function(x,y,t) {
         return this._animator.now({x: x, y: y}, t, animate.linear);
      })
      
      /*
        if (this.activeMole === false) {
    this.activeMole = true;
    this.activeInput = true;

    this._animator.now({y: mole_up}, 500, animate.EASE_IN)
      .wait(1000).then(bind(this, function () {
        this.activeInput = false;
      })).then({y: mole_down}, 200, animate.EASE_OUT)
      .then(bind(this, function () {
        this.activeMole = false;
      }));
  }
};
*/

	};
   
});