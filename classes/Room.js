class Room {
    constructor(name) {
        this.name = name;
        this.players = [null, null];
        this.time = 0;
        this.intervalId = null;
    }

    incrementPlayerScore(playerIndex) {
        this.players[playerIndex].incrementScore()
        return this.players[playerIndex].score;
    }

    addPlayer(player) {
        // get an empty player
        const emptyPlayerIndex = this.players.findIndex(p => p === null);
        if (emptyPlayerIndex !== -1) {
            this.players[emptyPlayerIndex] = player;
            return emptyPlayerIndex;
        } else {
            console.log("Room is full");
        }
    }

    removePlayer(player) {
        this.players = this.players.map((p) => p?.socketId === player.socketId ? null : p);
    }

    isEmpty() {
        return this.players.every((player) => player === null);
    }

    currentPlayerCount() {
        return this.players.filter((player) => player !== null).length;
    }

    startTimer() {
        this.intervalId = setInterval(() => {
            this.time++;
            if (this.time >= 120) {
                this.endGame();
            }
        }, 1000)
    }

    formatedTime() {
        const minutes = Math.floor(this.time / 60).toString().padStart(2, '0');
        const seconds = (this.time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    endGame() {
        this.time = 0;
        this.players = [null, null];
        clearInterval(this.intervalId);
    }

    getWinner() {
        if (this.players[0] === null) return 1;

        if (this.players[1] === null) return 0;

        // if two player in game check who has the best score
        let bestScore = 0;
        let winnerIndex = null;
        this.players.forEach((player, i) => {
            if (player.score > bestScore) {
                bestScore = player.score;
                winnerIndex = i;
            }
        });
        return winnerIndex;
    }
}

module.exports = Room;