let currentPlayer = "X";

document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", () => {
        const index = cell.getAttribute("data-index");
        if (cell.textContent === "") {
            fetch("/move", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ position: parseInt(index) })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    cell.textContent = currentPlayer;
                    currentPlayer = currentPlayer === "X" ? "O" : "X";
                    document.getElementById("status").textContent = `Player ${currentPlayer}'s turn`;
                    if (data.winner) {
                        if (data.winner === "Draw") {
                            alert("It's a draw!");
                        } else {
                            alert(`Player ${data.winner} wins!`);
                        }
                        resetGame();
                    }
                }
            });
        }
    });
});

document.getElementById("reset").addEventListener("click", resetGame);

function resetGame() {
    document.querySelectorAll(".cell").forEach(cell => cell.textContent = "");
    currentPlayer = "X";
    document.getElementById("status").textContent = `Player ${currentPlayer}'s turn`;
    fetch("/reset", { method: "POST" });
}