$(document).ready(function() { 
	//$.extend(window,{});
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
//funcion anonima de la clase tablero
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

	self.Board.prototype = {
		get elements() {
			var elements = this.bars.map(function(bar){return bar;});
			elements.push(this.ball);
			return elements;
		}
	};
})();

//clase barras de desplazamiento
(function() {
	self.Bar = function(x, y, width, height, board) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.board = board;
		this.board.bars.push(this);
		this.kind = "rectangle";
		this.speed = 20;
	};

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
		this.speed_x = 25;
		this.speed_y = 0;
		board.ball = this;
		this.kind = "circle";
		this.direction = 1;
	};

	self.Ball.prototype = {
		move: function() {
			this.x += (this.speed_x * this.direction);
			this.y += (this.speed_y); 
		}
	};
})();

//clase para dibujar el canvas
(function() {
	self.BoardView = function(canvas, board) {
		this.canvas = canvas;
		this.board = board;
		this.canvas.width = board.width;
		this.canvas.height = board.height;
		this.ctx = canvas.getContext("2d");
	};

	//modifica el objeto prototype
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
				this.draw();
				this.board.ball.move();
			}
		}
	};

	//method to draw elements in canvas
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
})();

//global vars
//const state = false;
var board = new Board(800, 550);
var bar = new Bar(20, 150, 40, 170, board);
var bar_2 = new Bar(740, 150, 40, 170, board);
var canvas_Id = $('#canvas')[0];
var board_view = new BoardView(canvas_Id, board);
var ball = new Ball(350, 100, 10, board);
board_view.draw();
//self.addEventListener("load", controller);
window.requestAnimationFrame(controller);

/**
 * [controller description]
 * @return {[type]} [description]
 */
function controller(){
	board_view.play();
	window.requestAnimationFrame(controller);
}