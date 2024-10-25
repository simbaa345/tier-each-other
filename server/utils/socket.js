const io = require('socket.io')();

function emitLobbyCreated(lobbyCode) {
    io.emit('lobby-created', lobbyCode);
}

function emitGameStarted(lobbyCode) {
    io.emit('game-started', lobbyCode);
}

module.exports = {
    emitLobbyCreated,
    emitGameStarted,
};