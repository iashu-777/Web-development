var board,
    game = new Chess();

function makeBestMove() {
    var bestMove = getBestMove(game.fen());
    game.move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    if (!game.game_over()) {
        window.setTimeout(makeBestMove, 250);
    }
}

function getBestMove(fen) {
    // Fetch the best move from your local proxy server
    fetch("http://localhost:3001/stockfish", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fen: fen,
            depth: 15
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Best move from Stockfish: ", data);
        var bestMove = data.move;
        if (bestMove) {
            game.move({
                from: bestMove.substring(0, 2),
                to: bestMove.substring(2, 4),
                promotion: 'q' // Always promote to a queen for simplicity
            });
            board.position(game.fen());
            renderMoveHistory(game.history());
            if (!game.game_over()) {
                window.setTimeout(makeBestMove, 250);
            }
        }
    })
    .catch(error => {
        console.error("Error fetching best move from Stockfish API: ", error);
    });
}

function renderMoveHistory(moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    historyElement.append(moves.join(', '));
}

function onDragStart(source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
}

function onDrop(source, target) {

    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // promote to queen
    });

    // Illegal move
    if (move === null) return 'snapback';

    renderMoveHistory(game.history());

    // make the best move for black
    window.setTimeout(makeBestMove, 250);
}

function onSnapEnd() {
    board.position(game.fen());
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};
board = Chessboard('board', config);
