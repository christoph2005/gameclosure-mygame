// devkit imports
import device;
import ui.StackView as StackView;

import src.TitleScreen as TitleScreen;
import src.GameScreen as GameScreen;

exports = Class(GC.Application, function () {

// Application structure taken from GameClosure's whack-a-mole example...

/* Run after the engine is created and the scene graph is in
  * place, but before the resources have been loaded.
  */
  this.initUI = function () {
    var titlescreen = new TitleScreen(),
        gamescreen = new GameScreen();

    this.view.style.backgroundColor = '#008a42  ';

    // Add a new StackView to the root of the scene graph
    // create everything at size 320x480, then scale so to
    // fit horizontally
    var screenWidth = 768;
    var screenHeight = 1364;
    var scale = device.width / screenWidth;
    var y = -1*(device.height-scale*screenHeight)/2;
    var rootView = new StackView({
      superview: this,
      x: 0,
      y:y,
      width: screenWidth,
      height: screenHeight,
      clip: true,
      scale: scale     
    });

   rootView.push(titlescreen);
   
   this.rootView = rootView;

   //----> Does sound even work? // var sound = soundcontroller.getSound();
   

   /* Listen for an event dispatched by the title screen when
    * the start button has been pressed. Hide the title screen,
    * show the game screen, then dispatch a custom event to the
    * game screen to start the game.
    */
    titlescreen.on('titlescreen:start', function () {
   //   sound.play('levelmusic');
      rootView.push(gamescreen);
      gamescreen.emit('app:start');
    });

   /* When the game screen has signalled that the game is over,
    * show the title screen so that the user may play the game again.
    */
    var view = this;
    gamescreen.on('gamescreen:end', function () {
      // ---> More sound related stuff  //sound.stop('levelmusic');
      if(rootView.stack.length > 1){
         rootView.pop()
      }
         view.style.backgroundColor = '#008a42';
    });
  };

  this.launchUI = function () {
  };

});
