from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Initialize the game board
board = [""] * 9
current_player = "X"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/move", methods=["POST"])
def move():
    global current_player
    data = request.json
    position = data["position"]

    # Check if the position is valid
    if board[position] == "":
        board[position] = current_player
        winner = check_winner()
        if winner:
            return jsonify({"board": board, "winner": winner})
        current_player = "O" if current_player == "X" else "X"
        return jsonify({"board": board, "winner": None})
    return jsonify({"error": "Invalid move"}), 400

def check_winner():
    winning_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
        [0, 4, 8], [2, 4, 6]              # Diagonals
    ]
    for combo in winning_combinations:
        if board[combo[0]] == board[combo[1]] == board[combo[2]] != "":
            return board[combo[0]]
    if "" not in board:
        return "Draw"
    return None

if __name__ == "__main__":
    app.run(debug=True)