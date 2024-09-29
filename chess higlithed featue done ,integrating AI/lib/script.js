var board1 = Chessboard('myBoard', 'start');

// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

var board = null;
var game = new Chess();
var $status = $('#status');
var $fen = $('#fen');
var $pgn = $('#pgn');
var aiEnabled = false;  // Default is human vs human

// Function to handle mode switching
function setMode(mode) {
  if (mode === 'ai') {
    aiEnabled = true;
    console.log('Switched to Human vs AI mode');
  } else {
    aiEnabled = false;
    console.log('Switched to Human vs Human mode');
  }
  updateStatus();
}

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
}

function onDrop(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for simplicity
  });

  // illegal move
  if (move === null) return 'snapback';

  updateStatus();

  // If AI mode is enabled, let AI make a move after the player's move
  if (aiEnabled && !game.game_over()) {
    window.setTimeout(makeAiMove, 250);
  }
}

function makeAiMove() {
  var fen = game.fen();

  // Make an AJAX call to the Python Flask server to get the AI move
  $.ajax({
    url: 'http://127.0.0.1:3001/ai_move',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ fen: fen }),
    success: function(response) {
      // AI makes its move
      game.move(response.move);
      board.position(game.fen());
      updateStatus();
    },
    error: function(error) {
      console.error('Error getting AI move:', error);
    }
  });
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen());
}

function updateStatus() {
  var status = '';

  var moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position';
  }

  // game still on
  else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  $status.html(status);
  $fen.html(game.fen());
  $pgn.html(game.pgn());
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};

board = Chessboard('myBoard', config);
updateStatus();
