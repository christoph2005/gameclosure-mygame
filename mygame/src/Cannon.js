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
          height = base_img.getHeight();
          
		this.cannon_base = new ui.ImageView({
         superview: this.view,
         image: base_img,
         x: 768/2-width/2,
         y: 1364-height,
         scale:1,
         width: width,
         height: height,
         zIndex:-1
      });
      this.addSubview(this.cannon_base);
      
      var width = base_img.getWidth(),
          height = base_img.getHeight()
      
		this.cannon_top = new ui.ImageView({
         superview: this.view,
         image: top_img,
         height: height*3,
         width: width,
         x: this.cannon_base.style.x,
         y: this.cannon_base.style.y-height*2.25 ,
         anchorX: width/2,
         anchorY: height*5/2,
         scale:.75,
         zIndex: -1
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
            now({r: (this.cannon_top.style.r)+(Math.PI*2)}, 100, animate.linear);
      });
      // Testing rotation animation
      var foreverRotate = bind(this,function(){
         return this.rotate().then(foreverRotate);
      });
      
      this.rotateTo = bind(this,function(x,y,t){
         /*
         return animate(this.cannon_top).
         now({r: Math.atan2(this.cannon_top.style.y-y,this.cannon_top.style.x-x)}, t, animate.linear);
         */
         /*
         this.cannon_top.style.r = Math.PI*3/2+Math.atan(this.cannon_top.style.y-y,this.cannon_top.style.x-x);
         */
         var r = Math.atan2(1364-y,382-x)-Math.PI/2;
         if (t){
            return animate(this.cannon_top).now({r: r}, t, animate.linear);
         } else {
            this.cannon_top.style.r = r;
            return animate(this.cannon_top);
         }
      });
      //foreverRotate();
      
	};
   
});