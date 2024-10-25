const express = require('express');
const router = express.Router();

// Start game
router.post('/start', (req, res) => {
    const lobbyCode = req.body.lobbyCode;

    // Start game logic
    startGame(lobbyCode);
    res.send('Game started');
});

module.exports = router;