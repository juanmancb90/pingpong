//eventos jQuery
$(function() {
	//global vars
	var board = new Board(800, 500);
	var canvasId = $('#contenedor')[0];
	var bar = new Bar(20, 150, 40, 150, board);
	var bar = new Bar(700, 150, 40, 150, board);
	var board_view = new BoardView(canvasId, board); 
	board_view.draw();
	//main();
	$(document).ready(function () {
		$(this).keydown(function (ev) {
			ev.preventDefault();
			//console.log(ev.keyCode);
			if (ev.keyCode == 38 || ev.keyCode == 87) {
				bar.up();
			} else if (ev.keyCode == 40 || ev.keyCode == 83) {
				bar.down();
			}
			console.log(bar.toString());
		});
	});
});

//manejo de objetos y mvc
//funcion anonima de la clase tablero
(function(){
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
			elements.push(this.ball);
			return elements;
		}
	};
})();

//clase barras de desplazamiento
(function(){
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
(function(){
	self.BoardView = function(canvas, board){
		this.canvas = canvas;
		this.board = board;
		this.canvas.width = board.width;
		this.canvas.height = board.height;
		this.ctx = canvas.getContext("2d");
	};

	//modifica el objeto prototype
	self.BoardView.prototype = {
		draw: function() {
			for (var i = this.board.elements.length - 1; i >= 0; i--) {
				var el = this.board.elements[i];
				drawElement(this.ctx, el);
			}
		},
	};

	//method to draw elements in canvas
	function drawElement(ctx, element) {
		if (element !== null && element.hasOwnProperty("kind")) {
			switch(element.kind) {
				case "rectangle":
					ctx.fillRect(element.x, element.y, element.width, element.height);
					break;
			}	
		}
	}
})();

/*
function main(){
	//llamar metodo draw del objeto de la clase BoarView
	//board_view.draw();
	//debuging 
	//console.log(board);
	//console.log(canvasId);
	//console.log(bar);
	//console.log(board_view);
	
}*/