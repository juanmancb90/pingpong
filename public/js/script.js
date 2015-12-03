/**
 * [description]
 * @param  {[type]} ) {            			$(this).keydown(function (ev) {		if (ev.keyCode [description]
 * @return {[type]}   [description]
 */
$(document).ready(function() { 
	//$.extend(window,{});
	window.requestAnimationFrame(controller);
	//document.addEventListener("keydown", function (ev){
	$(this).keydown(function (ev) {
		if (ev.keyCode === 38) {
			ev.preventDefault();
			bar.up();
		} else if (ev.keyCode === 40) {
			ev.preventDefault();
			bar.down();
		} else if (ev.keyCode === 87) {
			ev.preventDefault();
			bar_2.up();
		} else if (ev.keyCode === 83) {
			ev.preventDefault();
			bar_2.down();
		} else if (ev.keyCode === 32 ) {
			ev.preventDefault();
			board.playing = !board.playing;
		}
	});
});

//manejo de objetos y mvc
/**
 * funcion anonima de la clase tablero
 * @return {[type]} [description]
 */
(function() {
	//crear  objeto/clase y sus propiedades
	self.Board = function(width, height) {
		this.width = width;
		this.height = height;
		this.playing = false;
		this.game_over = false;
		this.bars = [];
		this.ball = null;
		this.playing = false;
	};

	/**
	 * [prototype description]
	 * @type {Object}
	 */
	self.Board.prototype = {
		get elements() {
			var elements = this.bars.map(function(bar){return bar;});
			elements.push(this.ball);
			return elements;
		}
	};
})();

/**
 * clase barras de desplazamiento
 * @return {[type]} [description]
 */
(function() {
	self.Bar = function(x, y, width, height, board) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.board = board;
		this.board.bars.push(this);
		this.kind = "rectangle";
		this.speed = 50;
	};

	/**
	 * [prototype description]
	 * @type {Object}
	 */
	self.Bar.prototype = {
		down: function() {
			this.y += this.speed;
		},
		up: function() {
			this.y -= this.speed;
		},
		toString: function() {
			return "x: "+this.x+" y: "+this.y;
		},
	};
})();

/**
 * class Ball
 * @return {[type]} [description]
 */
(function(){
	self.Ball = function(x, y, radio, board) {
		this.board = board;
		this.x = x;
		this.y = y;
		this.radio = radio;
		this.speed_x = 10;
		this.speed_y = 0;
		board.ball = this;
		this.kind = "circle";
		this.direction = 1;
		this.bounce_angle = 0;
		this.max_bounce_angle = Math.PI / 2;
		this.speed = 3;
	};

	/**
	 * [prototype description]
	 * @type {Object}
	 */
	self.Ball.prototype = {
		move: function() {
			this.x += (this.speed_x * this.direction);
			this.y += (this.speed_y); 
		},
		get width() {
			return this.radio * 2;
		},
		get height() {
			return this.radio * 2;
		},
		collition: function(bar) {
			var relative_inter_y = (bar.y + (bar.height / 2)) - this.y;
			var normalize_inter_y = relative_inter_y / (bar.height / 2);

			this.bounce_angle = normalize_inter_y * this.max_bounce_angle;
			this.speed_y = this.speed * -(Math.sin(this.bounce_angle));
			this.speed_x = this.speed * Math.cos(this.bounce_angle);

			if(this.x > (this.board.width / 2)) this.direction = -1;
			else this.direction = 1;
		},
	};
})();

/**
 * clase para dibujar el canvas
 * @return {[type]} [description]
 */
(function() {
	self.BoardView = function(canvas, board) {
		this.canvas = canvas;
		this.board = board;
		this.canvas.width = board.width;
		this.canvas.height = board.height;
		this.ctx = canvas.getContext("2d");
	};

	/**
	 * [prototype description]
	 * @type {Object}
	 */
	self.BoardView.prototype = {
		clean: function() {
			this.ctx.clearRect(0, 0, this.board.width, this.board.height);
		},
		draw: function() {
			for (var i = this.board.elements.length - 1; i >= 0; i--) {
				var el = this.board.elements[i];
				drawElement(this.ctx, el);
			}
		},
		play: function() {
			if (this.board.playing) {
				this.clean();
				console.log('clean end');
				this.draw();
				console.log('draw end');
				this.board.ball.move();
				console.log('moving');
				this.check_Collitions();
			}
		},
		check_Collitions: function() {
			for (var i = this.board.bars.length - 1; i >= 0; i--) {
				var el = this.board.bars[i];
				if (hitBars(el, this.board.ball)) {
					this.board.ball.collition(el);
				} /*else {
					this.board.game_over = true;
					console.log(this.board.game_over);
					if (confirm('Has Perdido. Volver a jugar')) {
						this.play();
					}
				}*/
			}
		},
	};

	/**
	 * [drawElement description]
	 * @param  {[type]} ctx     [description]
	 * @param  {[type]} element [description]
	 * @return {[type]}         [description]
	 */
	function drawElement(ctx, element) {
		switch(element.kind) {
			case "rectangle":
				ctx.fillRect(element.x, element.y, element.width, element.height);
				break;
			case "circle":
				ctx.beginPath();
				ctx.arc(element.x, element.y, element.radio, 0, 7);
				ctx.fill();
				ctx.closePath();
				break;
		}
	}

	/**
	 * [hitBars description]
	 * @param  {[type]} element [description]
	 * @param  {[type]} ball    [description]
	 * @return {[type]}         [description]
	 */
	function hitBars(element, ball) {
		var hit = false;
		if (ball.x + ball.width >= element.x && ball.x < element.width + element.x) {
			if (ball.y + ball.height >= element.y && ball.y < element.height + element.y) {
				hit = true;
			}
		} 
		if (ball.x <= element.x && element.x + element.width >= ball.x + ball.width) {
			if (ball.y <= element.y && element.y + element.height >= ball.y + ball.height) {
				hit = true;
			}
		}
		console.log('hit bars');
		return hit;
	}

	/**
	 * [hitBoard description]
	 * @param  {[type]} element [description]
	 * @param  {[type]} board   [description]
	 * @return {[type]}         [description]
	 */
	function hitBoard(element, board) {
		console.log('test collition with borders of board');
	}
})();

/**
 * global vars
 */
//const state = false;
var board = new Board(800, 550);
var bar = new Bar(20, 150, 40, 170, board);
var bar_2 = new Bar(740, 150, 40, 170, board);
var canvas_Id = $('#canvas')[0];
var board_view = new BoardView(canvas_Id, board);
var ball = new Ball(350, 250, 10, board);
console.log('global object created');
board_view.draw();
console.log('drawing board');

window.requestAnimationFrame(controller);

/**
 * [controller description]
 * @return {[type]} [description]
 */
function controller(){
	board_view.play();
	console.log('playing');
	window.requestAnimationFrame(controller);
}