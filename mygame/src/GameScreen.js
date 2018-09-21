/*
 * The game screen is a singleton view that consists of
 * a scoreboard and a bubbleshooter game.
 */

import animate;
import ui.View;
import ui.ImageView;
import ui.TextView;
import src.Gem as Gem;
import src.Cannon as Cannon;
import src.HexGrid as HexGrid;

/* Some game constants.
 */
var score = 0,
		high_score = 19,
		hit_value = 1,
		mole_interval = 600,
		game_on = false,
		game_length = 20000, //20 secs
		countdown_secs = game_length / 1000,
		lang = 'en',
      sw = 768, sh = 1364,
      ticks = 0, startTime = new Date();

/* The GameScreen view is a child of the main application.
 * By adding the scoreboard and the gamescreen as it's children,
 * everything is visible in the scene graph.
 */
exports = Class(ui.View, function (supr) {
   
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			width: sw,
			height: sh
		});

		supr(this, 'init', [opts]);
      this.style.backgroundColor = '#4B0082';
      
      this._bg = new ui.ImageView({
         superview: this,
			layout: "box",
         width: sw,
         height: sh,
         image: "resources/images/bubbles/ui/bg1_center.png",
         zIndex: -999999
      });
      this._bgh = new ui.ImageView({
         superview: this,
			layout: "box",
         width: sw,
         height: 275,
         image: "resources/images/bubbles/ui/bg1_header.png",
         zIndex: 999999
      });
      

		this.build();
	};

	/*
	 * Layout the scoreboard and molehills.
	 */
	this.build = function () {
		/* The start event is emitted from the start button via the main application.
		 */
		this.on('app:start', start_game_flow.bind(this));
      var that = this;
     

		/* The scoreboard displays the "ready, set, go" message,
		 * the current score, and the end game message. We'll set
		 * it as a hidden property on our class since we'll use it
		 * throughout the game.
		 */
		this._scoreboard = new ui.TextView({
			superview: this,
			x: 0,
			y: 15,
			width: 768,
			height: 140,
			autoSize: false,
			size: 120,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			wrap: false,
			color: '#FFFFFF',
         zIndex: 9999999
		});

		this.style.width = 768;
		this.style.height = 1000;

		//Set up countdown timer
		this._countdown = new ui.TextView({
			superview: this._scoreboard,
			visible: false,
			x: 600,
			y: -5,
			width: 120,
			height: 120,
			size: 120   ,
			color: '#FFFFFF',
			opacity: 0.7,
         zIndex: 99999999
		});
      
      var cannon = new Cannon();
      this.addSubview(cannon);
      
      var gem = new Gem();
      
      
      this.gridView = new HexGrid({});
      this.addSubview(this.gridView);
      
      this.moveGemToCannon = function(){return gem.moveTo(cannon.cannon_base.style.x+cannon.cannon_base.style.width/2,cannon.cannon_base.style.y+cannon.cannon_base.style.height/2-50);}; 
      this.moveGemToMouse = bind(this,function(){
         
         var mx = this.mouseX, my = this.mouseY;
         
         gem.moveToFor(mx,my,1000);
      });
      
      this.gems = [];
      this.gemMapToHex = [];
      for(var x=0; x<10; x++){
         this.gemMapToHex.push([null,null,null,null,null,null,null,null,null,null]);
         for(var y=0; y<6; y++){
            var point = this.gridView.points[x][y];
            var newGem = new Gem();
            newGem.gridX = x;
            newGem.gridY = y;
            this.addSubview(newGem);
            this.gems.push(newGem);
            this.gemMapToHex[x][y] = newGem;
            
            switch(Math.floor(Math.random()*5)){
               
               case 0:
                  newGem.setImage("ball_blue.png");
               break;
               
               case 1:
                  newGem.setImage("ball_red.png");
               break;
               
               case 2:
                  newGem.setImage("ball_yellow.png");
               break;
               
               case 3:
                  newGem.setImage("ball_purple.png");
               break;
               
               default:
                  newGem.setImage("ball_green.png");
               break;
            }
            newGem.moveTo(this.gridView.style.x+point.style.x,this.gridView.style.y+point.style.y);
            
            
         }
      }
      
      this.fireGem = bind(this,function(){
         if (gem.inUse) return;
         gem.inUse = true;
         this.moveGemToCannon().wait(100).then(bind(this,function(){
         this.addSubview(gem);
            // Calculate direction (using cannon angle)
            var theta = cannon.cannon_top.style.r;
            if (!theta) theta = 0;
            
            var R = 1000;
            var rx = R*Math.cos(theta-Math.PI/2)+gem.style.x,
                ry = R*Math.sin(theta-Math.PI/2)+gem.style.y;
            
            
            // Watch the gem to see where it goes...
            var gemWatchIntervalID = setInterval(bind(this,function(){
               for (var g in this.gems){
                  var dx = gem.style.x-this.gems[g].style.x,
                      dy = gem.style.y-this.gems[g].style.y;
                  var dist = Math.sqrt(dx*dx +dy*dy);
                  var sx = gem.style.width,
                      sy = gem.style.height;
                  if (dist<Math.sqrt(sx*sx+sy*sy)){
                     clearInterval(gemWatchIntervalID);
                     gem._animator.clear();
                     var other = this.gems[g];
                     
                     // Change the image of the one it collided with (for testing)
                     // other.setImage();
                     
                     // Add the gem to the hexGrid at the "right spot"
                     var newGem = new Gem();
                     newGem.gridX = other.gridX;
                     newGem.gridY = other.gridY;
                     newGem.gridY+=1;
                     if(gem.style.x>other.style.x){
                        //Ball should attach on right side
                        if(0 == newGem.gridY%2){
                           // EvenY - Ball attaches on the left, by default default (due to the nature of the grid)
                           newGem.gridX+=1;
                        }
                     } else {
                        //Ball should attach on left side
                        if(newGem.gridY%2){
                           // OddY - Ball attaches on the right, by default (due to the nature of the grid)
                           newGem.gridX-=1;
                        }
                     }
                     
                     if( newGem.gridX<0 || newGem.gridX>=this.gemMapToHex.length || newGem.gridY < 0 || newGem.gridY>=this.gemMapToHex[newGem.gridX].length)
                     {
                        delete newGem;
                        gem.moveTo(-900,-900);
                        this.removeSubview(gem);
                        gem.inUse = false;

                        return;
                     }
                     
                     this.gemMapToHex[newGem.gridX][newGem.gridY] = newGem;
                     this.addSubview(newGem);
                     this.gems.push(newGem);
                     var point = this.gridView.points[newGem.gridX][newGem.gridY];
                     //console.log("gridViewPoins?: "+this.gridview.points);
                     newGem.moveTo(this.gridView.style.x+point.style.x,this.gridView.style.y+point.style.y);
                     gem.moveTo(-900,-900);
                     this.removeSubview(gem);
                     gem.inUse = false;
                     
                     //Check for a combo
                     var bullet_color = gem.getImage();
                     newGem.setImage(bullet_color);
                     this.checkCombo = bind(this,function(){
                        for(var i in this.gems){
                           this.gems[i].visited = false;
                        }
                        var CCH = bind(this,function(curGem,matchingGems){
                           if(!curGem || typeof curGem == "undefined" ||curGem.visited) return false;
                           curGem.visited = true;
                           var x = curGem.gridX;
                           var y = curGem.gridY;
                           // Gem Neighbors:
                           var UL={},UR={},L={},R={},LL={},LR={}  ;
                           if(1 == y % 2) {
                              
                              UL.x = x;
                              UL.y = y-1;
                              
                              UR.x = x+1;
                              UR.y = y-1;
                              
                              L.x = x-1;
                              L.y = y;
                              
                              R.x = x+1;
                              R.y = y;
                              
                              LL.x = x;
                              LL.y = y+1;
                              
                              LR.x = x+1;
                              LR.y = y+1;
                           } else {
                              
                              UL.x = x-1;
                              UL.y = y-1;
                              
                              UR.x = x;
                              UR.y = y-1;
                              
                              L.x = x-1;
                              L.y = y;
                              
                              R.x = x+1;
                              R.y = y;
                              
                              LL.x = x-1;
                              LL.y = y+1;
                              
                              LR.x = x;
                              LR.y = y+1;
                           }
                           
                           if( UL.x>=0 && UL.x<this.gemMapToHex.length && UL.y >= 0 && y<this.gemMapToHex[UL.x].length)
                              UL.gem = this.gemMapToHex[UL.x][UL.y];
                           if( UR.x>=0 && UR.x<this.gemMapToHex.length && UR.y >= 0 && y<this.gemMapToHex[UR.x].length)
                              UR.gem = this.gemMapToHex[UR.x][UR.y]
                           if( L.x>=0 && L.x<this.gemMapToHex.length && L.y >= 0 && y<this.gemMapToHex[L.x].length)
                              L.gem = this.gemMapToHex[L.x][L.y];
                           if( R.x>=0 && R.x<this.gemMapToHex.length && R.y >= 0 && y<this.gemMapToHex[R.x].length)
                              R.gem = this.gemMapToHex[R.x][R.y];
                           if( LL.x>=0 && LL.x<this.gemMapToHex.length && LL.y >= 0 && y<this.gemMapToHex[LL.x].length)
                              LL.gem = this.gemMapToHex[LL.x][LL.y];
                           if( LR.x>=0 && LR.x<this.gemMapToHex.length && LR.y >= 0 && y<this.gemMapToHex[LR.x].length)
                              LR.gem = this.gemMapToHex[LR.x][LR.y];
                           
                        
                        
                        if(matchingGems.length == 0 || (curGem.getImage() == matchingGems[0].getImage())){
                        // 6 Recursive calls...
                        // Upper-left-match-case (and so on...)
                              matchingGems.push(curGem);
                           
                           var ULMC = CCH(UL.gem,matchingGems);
                           var URMC = CCH(UR.gem,matchingGems);
                           var LMC = CCH(L.gem,matchingGems);
                           var RMC = CCH(R.gem,matchingGems);
                           var LLMC = CCH(LL.gem,matchingGems);
                           var LRMC = CCH(LR.gem,matchingGems);
                        } else {
                           return false;
                        }
                        
                        });
                        var matchingGems = []
                        CCH(newGem,matchingGems);
                        if(matchingGems.length>=3){
                           score+= matchingGems.length;
                           this._scoreboard.setText(score.toString());
                           count = 0;
                           for(var e of matchingGems){
                              count++;
                              (function(gemMap){
                                 var t = 100*count;
                                 var g = e;
                                 setTimeout(bind(this,function(){
                                    g.moveTo(-999,-999);
                                    gemMap[g.gridX][g.gridY] = null;
                                    //console.log("Index: "+this.gems.indexOf(g));
                                 }),t);
                              })(this.gemMapToHex  );
                           }
                        }
                        
                     });
                     this.checkCombo();
                     
                     
                     break;
                  }
               }
            }),1);
            
            // Launch the gem in direction of the cannon
            gem.moveToFor(rx,ry,2000).then(bind(this,function(){
               if(gem.InUse) return;               
               gem.moveTo(-900,-900);
               clearInterval(gemWatchIntervalID);
               gem.inUse = false;
            }));
         }));
      });
      //Fire the gem to test...
      setTimeout(bind(this,function(){
         this.fireGem();
      }),2000);
      
      // Print grid object for debugging
      //console.log(this.gridView);
      
      this.inputView = new ui.View({
         superview: this.view,
         x:0,
         y:0,
         width:sw,
         height:sh,
         zIndex: 99999999999
      });
      this.addSubview(this.inputView);
      
      this.inputView.on('InputStart', bind(this, function (event,point) {
         this.mouseX = point.x;
         this.mouseY = point.y;
         cannon.rotateTo(this.mouseX,this.mouseY,100);
         //this.moveGemToCannon().then(this.moveGemToMouse);
         this.fireGem();
         
      }));
      
      this.inputView.on('InputMove', bind(this, function (event,point) {
         this.mouseX = point.x;
         this.mouseY = point.y;
         cannon.rotateTo(this.mouseX,this.mouseY);
      }));
      
      
	};
});

/*
 * Game play
 */

/* Manages the intro animation sequence before starting game.
 */
function start_game_flow () {
	var that = this;
	animate(that._scoreboard).wait(500)
		.then(function () {
			that._scoreboard.setText(text.READY);
		}).wait(300).then(function () {
			that._scoreboard.setText(text.SET);
		}).wait(300).then(function () {
			that._scoreboard.setText(text.GO);
			//start game ...
			game_on = true;
			play_game.call(that);
		});
}

/* With everything in place, the actual game play is quite simple.
 * Summon a non-active mole every n seconds. If it's hit, an event
 * handler on the molehill updates the score. After a set timeout,
 * stop calling the moles and proceed to the end game.
 */
function play_game () {
	var i = setInterval(tick.bind(this), mole_interval),
			j = setInterval(update_countdown.bind(this), 1000);

	setTimeout(bind(this, function () {
		game_on = false;
		clearInterval(i);
		clearInterval(j);
		setTimeout(end_game_flow.bind(this), mole_interval * 2);
		this._countdown.setText(":00");
	}), game_length);

	//Make countdown timer visible, remove start message if still there.
	setTimeout(bind(this, function () {
		this._scoreboard.setText(score.toString());
		this._countdown.style.visible = true;
	}), 333);

	//Running out of time! Set countdown timer red.
	setTimeout(bind(this, function () {
		this._countdown.updateOpts({color: '#CC0066'});
	}), game_length * 0.75);
}

/* tick*/
function tick () {
   //var elapsedTime = (Date.now()-startTime)/1000;
   //console.log(elapsedTime+" "+(++ticks)+" GAME ticks...");
}

/* Updates the countdown timer, pad out leading zeros.*/
function update_countdown () {
	countdown_secs -= 1;
	this._countdown.setText(":" + (("00" + countdown_secs).slice(-2)));
}

/* Check for high-score and play the ending animation.
 * Add a click-handler to the screen to return to the title
 * screen so we may play again.
 */
function end_game_flow () {
	var isHighScore = (score > high_score),
			end_msg = get_end_message(score, isHighScore);

	this._countdown.setText(''); //clear countdown text
	//resize scoreboard text to fit everything
	this._scoreboard.updateOpts({
		text: '',
		x: 10,
		fontSize: 17,
		verticalAlign: 'top',
		textAlign: 'left',
		multiline: true
	});

	//check for high-score and do appropriate animation
	if (isHighScore) {
		high_score = score;
	} else {
	}

	this._scoreboard.setText(end_msg);
/* Just don't bother "ending" the game for now...
	//slight delay before allowing a tap reset
	setTimeout(emit_endgame_event.bind(this), 200);
   */
}

/* Tell the main app to switch back to the title screen.
 */
function emit_endgame_event () {
	this.once('InputSelect', function () {
		reset_game.call(this);
		this.emit('gamescreen:end');
	});
}

/* Reset game counters and assets.
 */
function reset_game () {
	score = 0;
	countdown_secs = game_length / 1000;
	this._scoreboard.setText('');
	this._scoreboard.updateOpts({
		x: 0,
		fontSize: 38,
		verticalAlign: 'middle',
		textAlign: 'center',
		multiline: false
	});
	this._countdown.updateOpts({
		visible: false,
		color: '#fff'
	});
}

/*
 * Strings
 */

function get_end_message (score, isHighScore) {
	var moles = (score === 1) ? text.MOLE : text.MOLES,
			end_msg = text.END_MSG_START + '.\n';

	if (isHighScore) {
		end_msg += text.HIGH_SCORE + '\n';
	} else {
		//random taunt
		var i = (Math.random() * text.taunts.length) | 0;
		end_msg += text.taunts[i] + '\n';
	}
	return (end_msg += text.END_MSG_END);
}

var localized_strings = {
	en: {
		READY: "Ready ...",
		SET: "Set ...",
		GO: "GO!",
		MOLE: "",
		MOLES: "",
		END_MSG_START: "",
		END_MSG_END: "Tap to play again",
		HIGH_SCORE: "That's a new high score!"
	}
};

localized_strings['en'].taunts = [
	"Welcome to Loserville, population: you.", //max length
	"You're an embarrassment!",
	"You'll never catch me!",
	"Your days are numbered, human.",
	"Don't quit your day job.",
	"Just press the screen, it's not hard.",
	"You might be the worst I've seen.",
	"You're just wasting my time.",
	"Don't hate the playa, hate the game.",
	"Make like a tree, and get out of here!"
];

//object of strings used in game
var text = localized_strings[lang.toLowerCase()];