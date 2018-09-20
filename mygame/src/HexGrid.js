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
         height: 1364*.80 - 100,
         zIndex:9999999999999,
         opacity: 0.4
		});

		supr(this, 'init', [opts]);
		
      this.build();
	};
	/*
	 * Layout
	 */
	this.build = function () {
      //this.grid = {};
      this.numCols = 10;
      this.gridDX = this.style.width/(this.numCols);
      this.gridSize = this.gridDX/Math.sqrt(3);
      this.gridDY = this.gridSize*3/2;
      
      this.point = bind(this,function(x,y){
         var dotView = new ui.View({
            superview: this.view,
            backgroundColor:"#000000",
            x: x*this.gridDX+(y%2?this.gridDX/2:0),
            y: y*this.gridDY,
            width: this.gridSize*0.1,
            height: this.gridSize*0.1,
            zIndex: 999999999999999
         });
         this.addSubview(dotView);
         return dotView;
      });
      this.points = [];
      for(var x=0; x<10; x++){
         this.points.push([]);
         for(var y=0; y<15; y++){
            this.points[x].push(new this.point(x,y));
         }
      }
      
      
	};
   
});