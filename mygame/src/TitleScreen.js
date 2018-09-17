import ui.View;
import ui.TextView as TextView;
import device;

exports = Class(ui.View, function (supr) {
  this.init = function (opts) {
    opts = merge(opts, {
    });
    supr(this, 'init', [opts]);
    
    var sw = 320;
    var sh = 480; 
    
    var width = 0.8 * sw;
    var x = sw/2 - sw/2;
    var y = sh/2 - 50;
    console.log(y);
    
    this.startbutton = new TextView({
      superview: this,
      text: 'Start',
      color: 'white',
      x: x,
      y: y,
      horizontalAlign: 'center', 
      width: width,
      height: 100
    });
    
    this.startbutton.on('InputSelect', bind(this, function () {
      this.emit('titlescreen:start');
    }));
    
  };
});