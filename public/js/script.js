$(function(){
	console.log('start');
	main();
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
		get elements(){
			var elements = this.bars;
			elements.push(ball);
			return	elements;
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
		this.kind = "rectangule";
	};

	self.Board.prototype = {
		down: function() {},
		up: function() {},
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
})();

//metodo principal
function main(){
	var board = new Board(800, 400);
	console.log(board);
	var canvasId = $('#contenedor')[0];
	console.log(canvasId);
	var board_view = new BoardView(canvasId, board);
	console.log(board_view);
}