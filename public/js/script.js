$(document).ready(function() { 
	//$.extend(window,{});
	//document.addEventListener("keydown", function (ev){
	$(this).keydown(function (ev) {	
		ev.preventDefault();
		if (ev.keyCode == 38) {
			bar.up();
		} else if (ev.keyCode == 40) {
			bar.down();
		} else if (ev.keyCode == 87) {
			bar_2.up();
		} else if (ev.keyCode == 83) {
			bar_2.down();
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
	};

	self.Board.prototype = {
		get elements() {
			var elements = this.bars;
			//elements.push(this.ball);
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
		this.speed = 10;
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
		}
	};

	//method to draw elements in canvas
	function drawElement(ctx, element) {
		//if (element !== null && element.hasOwnProperty("kind")) {
		switch(element.kind) {
			case "rectangle":
				ctx.fillRect(element.x, element.y, element.width, element.height);
				break;
		}	
		//}
	}
})();

//global vars
//const state = false;
var board = new Board(800, 500);
var bar = new Bar(20, 150, 40, 150, board);
var bar_2 = new Bar(700, 150, 40, 150, board);
var canvas_Id = $('#canvas')[0];
var board_view = new BoardView(canvas_Id, board);

//self.addEventListener("load", controller);
window.requestAnimationFrame(controller);

function controller(){
	board_view.clean();
	board_view.draw();
	window.requestAnimationFrame(controller);
}