let main = {
    variables: {
        turn: 'w',
        selectedpiece: '',
        highlighted: [],
        pieces: {
            w_king: { position: '5_1', img: '&#9812;', captured: false, moved: false, type: 'w_king' },
            w_queen: { position: '4_1', img: '&#9813;', captured: false, moved: false, type: 'w_queen' },
            w_bishop1: { position: '3_1', img: '&#9815;', captured: false, moved: false, type: 'w_bishop' },
            w_bishop2: { position: '6_1', img: '&#9815;', captured: false, moved: false, type: 'w_bishop' },
            w_knight1: { position: '2_1', img: '&#9816;', captured: false, moved: false, type: 'w_knight' },
            w_knight2: { position: '7_1', img: '&#9816;', captured: false, moved: false, type: 'w_knight' },
            w_rook1: { position: '1_1', img: '&#9814;', captured: false, moved: false, type: 'w_rook' },
            w_rook2: { position: '8_1', img: '&#9814;', captured: false, moved: false, type: 'w_rook' },
            w_pawn1: { position: '1_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
            w_pawn2: { position: '2_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
            w_pawn3: { position: '3_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
            w_pawn4: { position: '4_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
            w_pawn5: { position: '5_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
            w_pawn6: { position: '6_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
            w_pawn7: { position: '7_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
            w_pawn8: { position: '8_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },

            b_king: { position: '5_8', img: '&#9818;', captured: false, moved: false, type: 'b_king' },
            b_queen: { position: '4_8', img: '&#9819;', captured: false, moved: false, type: 'b_queen' },
            b_bishop1: { position: '3_8', img: '&#9821;', captured: false, moved: false, type: 'b_bishop' },
            b_bishop2: { position: '6_8', img: '&#9821;', captured: false, moved: false, type: 'b_bishop' },
            b_knight1: { position: '2_8', img: '&#9822;', captured: false, moved: false, type: 'b_knight' },
            b_knight2: { position: '7_8', img: '&#9822;', captured: false, moved: false, type: 'b_knight' },
            b_rook1: { position: '1_8', img: '&#9820;', captured: false, moved: false, type: 'b_rook' },
            b_rook2: { position: '8_8', img: '&#9820;', captured: false, moved: false, type: 'b_rook' },
            b_pawn1: { position: '1_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false },
            b_pawn2: { position: '2_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false },
            b_pawn3: { position: '3_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false },
            b_pawn4: { position: '4_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false },
            b_pawn5: { position: '5_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false },
            b_pawn6: { position: '6_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false },
            b_pawn7: { position: '7_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false },
            b_pawn8: { position: '8_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false }
        }
    },

    methods: {
        gamesetup: function () {
            $('.gamecell').attr('chess', 'null');
            for (let gamepiece in main.variables.pieces) {
                $('#' + main.variables.pieces[gamepiece].position).html(main.variables.pieces[gamepiece].img);
                $('#' + main.variables.pieces[gamepiece].position).attr('chess', gamepiece);
            }
            main.methods.randomizePieces();
        },

        randomizePieces: function () {
            const rand = Math.random() > 0.5;
            if (rand) {
                // Swap white and black pieces
                for (let key in main.variables.pieces) {
                    if (key.startsWith('w_')) {
                        let temp = main.variables.pieces[key].position;
                        main.variables.pieces[key].position = main.variables.pieces[key.replace('w_', 'b_')].position;
                        main.variables.pieces[key.replace('w_', 'b_')].position = temp;
                    }
                }
                main.methods.gamesetup(); // Re-setup the game with new positions
            }
        },

        moveoptions: function (selectedpiece) {
            // Reset highlighting
            if (main.variables.highlighted.length != 0) {
                main.methods.togglehighlight(main.variables.highlighted);
            }

            let position = main.variables.pieces[selectedpiece].position.split('_');
            let x = parseInt(position[0]);
            let y = parseInt(position[1]);
            let options = [];

            switch (main.variables.pieces[selectedpiece].type) {
                case 'w_king':
                case 'b_king':
                    // King movement logic
                    options = this.calculateKingMoves(x, y);
                    break;
                case 'w_pawn':
                case 'b_pawn':
                    // Pawn movement logic
                    options = this.calculatePawnMoves(x, y, selectedpiece);
                    break;
                case 'w_queen':
                case 'b_queen':
                    // Queen movement logic
                    options = this.calculateQueenMoves(x, y);
                    break;
                case 'w_rook':
                case 'b_rook':
                    // Rook movement logic
                    options = this.calculateRookMoves(x, y);
                    break;
                case 'w_bishop':
                case 'b_bishop':
                    // Bishop movement logic
                    options = this.calculateBishopMoves(x, y);
                    break;
                case 'w_knight':
                case 'b_knight':
                    // Knight movement logic
                    options = this.calculateKnightMoves(x, y);
                    break;
            }

            // Highlight the valid moves
            main.variables.highlighted = options;
            main.methods.togglehighlight(options);
        },

        calculateKingMoves: function (x, y) {
            let moves = [];
            let potentialMoves = [
                [1, 1], [1, 0], [1, -1], [0, -1],
                [-1, -1], [-1, 0], [-1, 1], [0, 1]
            ];

            potentialMoves.forEach(move => {
                let newX = x + move[0];
                let newY = y + move[1];
                if (this.isInBounds(newX, newY)) {
                    moves.push(newX + '_' + newY);
                }
            });

            return moves.filter(move => {
                let targetPiece = $('#' + move).attr('chess');
                return targetPiece == 'null' || targetPiece[0] != main.variables.pieces[selectedpiece].type[0];
            });
        },

        calculatePawnMoves: function (x, y, selectedpiece) {
            let moves = [];
            let direction = main.variables.pieces[selectedpiece].type[0] == 'w' ? 1 : -1;
            let startRow = main.variables.pieces[selectedpiece].moved ? 1 : 2; // Allow two squares move on first move

            // Standard forward move
            if (this.isInBounds(x, y + direction)) {
                if ($('#' + x + '_' + (y + direction)).attr('chess') == 'null') {
                    moves.push(x + '_' + (y + direction));
                }
            }

            // Capture diagonally
            if (this.isInBounds(x + 1, y + direction)) {
                if ($('#' + (x + 1) + '_' + (y + direction)).attr('chess') && $('#' + (x + 1) + '_' + (y + direction)).attr('chess')[0] != main.variables.pieces[selectedpiece].type[0]) {
                    moves.push((x + 1) + '_' + (y + direction));
                }
            }
            if (this.isInBounds(x - 1, y + direction)) {
                if ($('#' + (x - 1) + '_' + (y + direction)).attr('chess') && $('#' + (x - 1) + '_' + (y + direction)).attr('chess')[0] != main.variables.pieces[selectedpiece].type[0]) {
                    moves.push((x - 1) + '_' + (y + direction));
                }
            }

            return moves;
        },

        calculateQueenMoves: function (x, y) {
            let moves = [];
            // Combine rook and bishop moves
            moves = moves.concat(this.calculateRookMoves(x, y));
            moves = moves.concat(this.calculateBishopMoves(x, y));
            return moves;
        },

        calculateRookMoves: function (x, y) {
            let moves = [];
            // Horizontal and vertical moves
            for (let i = 1; i <= 8; i++) {
                if (this.isInBounds(x + i, y)) moves.push((x + i) + '_' + y);
                if (this.isInBounds(x - i, y)) moves.push((x - i) + '_' + y);
                if (this.isInBounds(x, y + i)) moves.push(x + '_' + (y + i));
                if (this.isInBounds(x, y - i)) moves.push(x + '_' + (y - i));
            }
            return moves.filter(move => {
                let targetPiece = $('#' + move).attr('chess');
                return targetPiece == 'null' || targetPiece[0] != main.variables.pieces[selectedpiece].type[0];
            });
        },

        calculateBishopMoves: function (x, y) {
            let moves = [];
            // Diagonal moves
            for (let i = 1; i <= 8; i++) {
                if (this.isInBounds(x + i, y + i)) moves.push((x + i) + '_' + (y + i));
                if (this.isInBounds(x + i, y - i)) moves.push((x + i) + '_' + (y - i));
                if (this.isInBounds(x - i, y + i)) moves.push((x - i) + '_' + (y + i));
                if (this.isInBounds(x - i, y - i)) moves.push((x - i) + '_' + (y - i));
            }
            return moves.filter(move => {
                let targetPiece = $('#' + move).attr('chess');
                return targetPiece == 'null' || targetPiece[0] != main.variables.pieces[selectedpiece].type[0];
            });
        },

        calculateKnightMoves: function (x, y) {
            let moves = [];
            let potentialMoves = [
                [2, 1], [2, -1], [-2, 1], [-2, -1],
                [1, 2], [1, -2], [-1, 2], [-1, -2]
            ];

            potentialMoves.forEach(move => {
                let newX = x + move[0];
                let newY = y + move[1];
                if (this.isInBounds(newX, newY)) {
                    moves.push(newX + '_' + newY);
                }
            });

            return moves.filter(move => {
                let targetPiece = $('#' + move).attr('chess');
                return targetPiece == 'null' || targetPiece[0] != main.variables.pieces[selectedpiece].type[0];
            });
        },

        isInBounds: function (x, y) {
            return x >= 1 && x <= 8 && y >= 1 && y <= 8;
        },

        pawnPromotion: function (pawn, position) {
            const choice = prompt("Choose promotion: queen, rook, knight, bishop");
            let newPieceType = '';

            switch (choice.toLowerCase()) {
                case 'queen':
                    newPieceType = pawn[0] + '_queen';
                    break;
                case 'rook':
                    newPieceType = pawn[0] + '_rook';
                    break;
                case 'knight':
                    newPieceType = pawn[0] + '_knight';
                    break;
                case 'bishop':
                    newPieceType = pawn[0] + '_bishop';
                    break;
                default:
                    alert("Invalid choice. Defaulting to Queen.");
                    newPieceType = pawn[0] + '_queen';
            }

            main.variables.pieces[pawn].img = main.variables.pieces[newPieceType].img;
            $('#' + position).html(main.variables.pieces[newPieceType].img);
        },

        capture: function (target) {
            let selectedpiece = {
                name: $('#' + main.variables.selectedpiece).attr('chess'),
                id: main.variables.selectedpiece
            };

            $('#' + target.id).html(main.variables.pieces[selectedpiece.name].img);
            $('#' + target.id).attr('chess', selectedpiece.name);
            $('#' + selectedpiece.id).html('');
            $('#' + selectedpiece.id).attr('chess', 'null');

            main.variables.pieces[selectedpiece.name].position = target.id;
            main.variables.pieces[selectedpiece.name].moved = true;

            if (target.name.includes('knight')) {
                alert("Game Over! A knight has been captured.");
                setTimeout(() => location.reload(), 2000); // Restart game after 2 seconds
            }
        },

        move: function (target) {
            let selectedpiece = $('#' + main.variables.selectedpiece).attr('chess');
            $('#' + target.id).html(main.variables.pieces[selectedpiece].img);
            $('#' + target.id).attr('chess', selectedpiece);
            $('#' + main.variables.selectedpiece).html('');
            $('#' + main.variables.selectedpiece).attr('chess', 'null');

            main.variables.pieces[selectedpiece].position = target.id;
            main.variables.pieces[selectedpiece].moved = true;

            // Check for pawn promotion
            if (selectedpiece.includes('pawn')) {
                let yPosition = target.id.split('_')[1];
                if (yPosition == '8' || yPosition == '1') {
                    main.methods.pawnPromotion(selectedpiece, target.id);
                }
            }
        },

        endturn: function () {
            if (main.variables.turn == 'w') {
                main.variables.turn = 'b';
                $('#turn').html("It's Black's Turn");
                this.checkmate('b'); // Check for checkmate after ending white's turn
            } else {
                main.variables.turn = 'w';
                $('#turn').html("It's White's Turn");
                this.checkmate('w'); // Check for checkmate after ending black's turn
            }
        },

        togglehighlight: function (options) {
            options.forEach(function (element) {
                $('#' + element).toggleClass("green shake-little neongreen_txt");
            });
        },

        checkmate: function (color) {
            let kingPosition = color == 'w' ? main.variables.pieces.w_king.position : main.variables.pieces.b_king.position;
            let isCheckmate = true;

            // Check if the king is in check
            if (this.isInCheck(color, kingPosition)) {
                // Check if there are any valid moves left for the king
                let kingMoves = this.calculateKingMoves(kingPosition.split('_')[0], kingPosition.split('_')[1]);
                if (kingMoves.length > 0) {
                    isCheckmate = false;
                }
            } else {
                isCheckmate = false; // King is not in check
            }

            if (isCheckmate) {
                alert(color == 'w' ? "Checkmate! Black wins!" : "Checkmate! White wins!");
                setTimeout(() => location.reload(), 2000); // Restart game after 2 seconds
            }
        },

        isInCheck: function (color, kingPosition) {
            let opponentPieces = color == 'w' ? 'b_' : 'w_';
            // Check all opponent pieces to see if they can attack the king's position
            for (let piece in main.variables.pieces) {
                if (piece.startsWith(opponentPieces)) {
                    let pieceMoves = this.moveoptions(piece);
                    if (pieceMoves.includes(kingPosition)) {
                        return true; // King is in check
                    }
                }
            }
            return false; // King is not in check
        },
    }
};

$(document).ready(function () {
    main.methods.gamesetup();

    $('.gamecell').click(function (e) {
        var selectedpiece = {
            name: '',
            id: main.variables.selectedpiece
        };

        if (main.variables.selectedpiece == '') {
            selectedpiece.name = $('#' + e.target.id).attr('chess');
        } else {
            selectedpiece.name = $('#' + main.variables.selectedpiece).attr('chess');
        }

        var target = {
            name: $(this).attr('chess'),
            id: e.target.id
        };

        if (main.variables.selectedpiece == '' && target.name.slice(0, 1) == main.variables.turn) {
            main.variables.selectedpiece = e.target.id;
            main.methods.moveoptions($(this).attr('chess'));
        } else if (main.variables.selectedpiece != '' && target.name == 'null') {
            if (selectedpiece.name.includes('_king')) {
                // Add king movement logic
            } else {
                main.methods.move(target);
                main.methods.endturn();
            }
        } else if (main.variables.selectedpiece != '' && target.name != 'null' && target.id != selectedpiece.id && selectedpiece.name.slice(0, 1) != target.name.slice(0, 1)) {
            main.methods.capture(target);
            main.methods.endturn();
        } else if (main.variables.selectedpiece != '' && target.name != 'null' && target.id != selectedpiece.id && selectedpiece.name.slice(0, 1) == target.name.slice(0, 1)) {
            main.methods.togglehighlight(main.variables.highlighted);
            main.variables.highlighted.length = 0;
            main.variables.selectedpiece = target.id;
            main.methods.moveoptions(target.name);
        }
    });

    $('body').contextmenu(function (e) {
        e.preventDefault();
    });
});
