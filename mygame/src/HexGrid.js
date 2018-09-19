import animate;
import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;
//import src.soundcontroller as soundcontroller;

    
exports = Class(ui.View, function (supr) {

	this.init = function (opts) {
		opts = merge(opts, {
         superview: this.view,
         backgroundColor: "#FF0000",
         x: 50,
         y: 50,
         width: 768 - 100,
         height: 1364 - 100,
         zIndex:1,
         opacity: 0.3
		});

		supr(this, 'init', [opts]);
		
      this.build();
	};

	/*
	 * Layout
	 */
	this.build = function () {
      
      
	};
   
});