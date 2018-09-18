import ui.View;
import ui.TextView as TextView;
import device;

exports = Class(ui.View, function (supr) {
  this.init = function (opts) {
    var view = this;
    var sw = 768;
    var sh = 1364;
    
    opts = merge(opts, {
      x: 0,
      y: 0,
      width: sw,
      height: sh,
    });
    supr(this, 'init', [opts]);
    
    view
    .style.backgroundColor = '#006400';
      
    var width = 0.8 * sw;
    var x = sw/2 - sw/2;
    var y = sh/2 - 50;
    
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