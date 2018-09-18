/*
 * The game screen is a singleton view that consists of
 * a scoreboard and a bubbleshooter game.
 */

import animate;
import ui.View;
import ui.ImageView;
import ui.TextView;
import src.Gem as Gem;

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
      sw = 768, sh = 1364;

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
			color: '#FFFFFF'
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
			opacity: 0.7
		});
      
      this._gems = [];
      var gem = new Gem();
      this._gems.push(gem);
      this.addSubview(gem);
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

	//slight delay before allowing a tap reset
	setTimeout(emit_endgame_event.bind(this), 200);
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
			end_msg = text.END_MSG_START + ' ' + score + ' ' + moles + '.\n';

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
		MOLE: "mole",
		MOLES: "moles",
		END_MSG_START: "You whacked",
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