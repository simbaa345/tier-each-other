class Player {
    constructor(username) {
        this.username = username;
        this.score = 0;
    }

    updateScore(score) {
        this.score = score;
    }
}

module.exports = Player;