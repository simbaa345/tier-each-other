const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Lobby = require('./models/Lobby');

// Set up routes
const lobbyRoute = require('./routes/lobby');
const gameRoute = require('./routes/game');

app.use('/lobby', lobbyRoute);
app.use('/game', gameRoute);

// Set up socket events
io.on('connection', (socket) => {
    console.log('Client connected');

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    // Handle join game event
    socket.on('join-game', (data) => {
        const lobbyCode = data.lobbyCode;
        const username = data.username;

        // Check if lobby exists
        if (lobbyExists(lobbyCode)) {
            // Add player to lobby
            addPlayerToLobby(lobbyCode, username);
            socket.join(lobbyCode);
        } else {
            socket.emit('error', 'Lobby does not exist');
        }
    });

    // Handle host game event
    socket.on('host-game', (data) => {
        const username = data.username;

        // Create new lobby
        const lobbyCode = generateLobbyCode();
        createLobby(lobbyCode, username);

        // Add host to lobby
        addPlayerToLobby(lobbyCode, username);
        socket.join(lobbyCode);

        // Emit lobby code to host
        socket.emit('lobby-created', lobbyCode);
    });

    // Handle start game event
    socket.on('start-game', (data) => {
        const lobbyCode = data.lobbyCode;

        // Start game logic
        startGame(lobbyCode);
    });

    // Handle send tier list event
    socket.on('send-tier-list', (tierList) => {
        // Handle tier list from client
        handleTierList(tierList);
    });
});

// Function to check if lobby exists
function lobbyExists(lobbyCode) {
    // Check if lobby exists in lobbies object
    return lobbies[lobbyCode] !== undefined;
}

// Function to add player to lobby
function addPlayerToLobby(lobbyCode, username) {
    // Add player to lobby
    lobbies[lobbyCode].players.push(username);
}

// Function to generate lobby code
function generateLobbyCode() {
    // Generate random lobby code
    return Math.random().toString(36).substr(2, 6);
}

// Function to create lobby
function createLobby(lobbyCode, username) {
    // Create new lobby
    lobbies[lobbyCode] = new Lobby(lobbyCode, username);
}

// Function to start game
function startGame(lobbyCode) {
    // Get lobby details
    const lobby = lobbies[lobbyCode];

    // Check if lobby is full
    if (lobby.players.length < 2) {
        console.log('Lobby is not full');
        return;
    }

    // Generate random category and items
    const category = generateRandomCategory();
    const items = generateRandomItems(category);

    // Create tier list
    const tierList = [
        { name: 'S', items: [] },
        { name: 'A', items: [] },
        { name: 'B', items: [] },
        { name: 'C', items: [] },
        { name: 'D', items: [] },
        { name: 'F', items: [] },
    ];

    // Emit start game event to clients
    io.to(lobbyCode).emit('start-game', { category, items, tierList });

    // Set up game timer
    setTimeout(async () => {
        // Get player tier lists
        const playerTierLists = [];

        for (const player of lobby.players) {
            try {
                const playerTierList = await getPlayerTierList(player);
                playerTierLists.push(playerTierList);
            } catch (error) {
                console.error(error);
            }
        }

        // Calculate scores
        const scores = calculateScores(playerTierLists);

        // Emit game results event to clients
        io.to(lobbyCode).emit('game-results', scores);
    }, 120000); // 2 minutes
}

// Function to generate random items
function generateRandomItems(category) {
    const items = [];

    switch (category) {
        case 'Movies':
            items = ['The Shawshank Redemption', 'The Godfather', 'The Dark Knight'];
            break;
        case 'Music':
            items = ['Thriller', 'Bohemian Rhapsody', 'Stairway to Heaven'];
            break;
        case 'Sports':
            items = ['Football', 'Basketball', 'Tennis'];
            break;
        case 'Games':
            items = ['Minecraft', 'Grand Theft Auto V', 'The Last of Us'];
            break;
    }

    return items;
}

// Function to get player tier list
function getPlayerTierList(player) {
    return new Promise((resolve, reject) => {
        // Emit event to client to send tier list
        io.to(player.socketId).emit('send-tier-list');

        // Listen for tier list from client
        io.on('tier-list', (tierList) => {
            resolve(tierList);
        });

        // Set timeout to handle case where client doesn't respond
        setTimeout(() => {
            reject('Player did not respond with tier list');
        }, 10000); // 10 seconds
    });
}

// Function to calculate scores
function calculateScores(playerTierLists) {
    const scores = [];

    playerTierLists.forEach((tierList) => {
        let score = 0;

        tierList.forEach((tier) => {
            // Calculate score based on tier
            score += tier.items.length * (tier.name === 'S' ? 5 : tier.name === 'A' ? 4 : tier.name === 'B' ? 3 : tier.name === 'C' ? 2 : tier.name === 'D' ? 1 : 0);
        });

        scores.push(score);
    });

    return scores;
}

// Function to handle tier list from client
function handleTierList(tierList) {
    // Handle tier list from client
    console.log(tierList);
}

// Set up lobbies object
const lobbies = {};

// Start server
const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Server started on port ${port}`);
});