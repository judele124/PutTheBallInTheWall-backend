class Player {
    score = 0
    socketId
    constructor(socketId) {
        this.socketId = socketId
    }

    socketId(socketId) {
        this.socketId = socketId
    }
    socketId() {
        return this.socketId
    }

    incrementScore() {
        this.score++
    }
    score() {
        return this.score
    }

}

module.exports = Player