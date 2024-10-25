const express = require('express');
const router = express.Router();

// Create lobby
router.post('/create', (req, res) => {
    const lobbyCode = req.body.lobbyCode;
    const username = req.body.username;

    // Check if lobby exists
    if (lobbyExists(lobbyCode)) {
        res.status(400).send('Lobby already exists');
    } else {
        createLobby(lobbyCode, username);
        res.send('Lobby created');
    }
});

// Join lobby
router.post('/join', (req, res) => {
    const lobbyCode = req.body.lobbyCode;
    const username = req.body.username;

    // Check if lobby exists
    if (lobbyExists(lobbyCode)) {
        addPlayerToLobby(lobbyCode, username);
        res.send('Player added to lobby');
    } else {
        res.status(400).send('Lobby does not exist');
    }
});

module.exports = router;