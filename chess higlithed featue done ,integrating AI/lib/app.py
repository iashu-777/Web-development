from flask import Flask, jsonify, request
import chess
import chess.engine
from flask_cors import CORS  # Enable CORS

app = Flask(__name__)
CORS(app)  # Add this line

# Path to Stockfish engine
engine_path = "C:/stockfish/stockfish-windows-x86-64-sse41-popcnt.exe"

@app.route('/ai_move', methods=['POST'])
def ai_move():
    board_fen = request.json.get('fen')
    
    board = chess.Board(board_fen)
    with chess.engine.SimpleEngine.popen_uci(engine_path) as engine:
        # Use Stockfish engine to compute the best move
        result = engine.play(board, chess.engine.Limit(time=1.0))
    
    return jsonify({
        'move': result.move.uci()  # Send the best move in UCI format
    })

if __name__ == '__main__':
    app.run(port=3001, debug=True)  # Specify the port if necessary
