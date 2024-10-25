class Lobby {
    constructor(lobbyCode, host) {
        this.lobbyCode = lobbyCode;
        this.host = host;
        this.players = [];
    }

    addPlayer(username) {
        this.players.push(username);
    }

    removePlayer(username) {
        const index = this.players.indexOf(username);
        if (index !== -1) {
            this.players.splice(index, 1);
        }
    }
}

module.exports = Lobby;