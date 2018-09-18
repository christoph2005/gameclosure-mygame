import animate;
import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;
//import src.soundcontroller as soundcontroller;

var base_img = new Image({url: "resources/images/bubbles/ui/cannon_base.png"}),
    top_img = new Image({url: "resources/images/bubbles/ui/cannon_top.png"});
    
exports = Class(ui.View, function (supr) {

	this.init = function (opts) {
		opts = merge(opts, {
			width:	base_img.getWidth(),
			height: base_img.getHeight()+top_img.getHeight()/2
		});

		supr(this, 'init', [opts]);
     
		this.build();
	};

	/*
	 * Layout
	 */
	this.build = function () {
      
      var width = base_img.getWidth(),
          height = base_img.getHeight()+top_img.getHeight()/2;
          
		this.cannon_base = new ui.ImageView({
         superview: this.view,
         image: base_img,
         x: 768/2-width/2,
         y: 1364-height,
         scale:1,
         width: width,
         height: height
      });
      this.addSubview(this.cannon_base);
      
		this.cannon_top = new ui.ImageView({
         superview: this.view,
         image: top_img,
         x: this.cannon_base.style.x,
         y: this.cannon_base.style.y-600,
         anchorX: width/2,
         anchorY: height/1.5,
         scale:0.75,
         width: width,
         height: height
      });
      this.addSubview(this.cannon_top);
      
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
      
      // Template for other rotate functions
      this.rotate = bind(this,function(){
            console.log("rotating");
            return animate(this.cannon_top).
            now({r: (this.cannon_top.style.r)+(Math.PI*2)}, 1000, animate.linear);
      });
      // Testing rotation animation
      var foreverRotate = bind(this,function(){
         return this.rotate().then(foreverRotate);
      });
      
      this.rotateTo = bind(this,function(x,y,t){
         if (x>0&& y>0){
            return animate(this.cannon_top).
            now({r: Math.atan2(y,x)}, t, animate.linear);
         } else {
         }
      });
      
	};
   
});