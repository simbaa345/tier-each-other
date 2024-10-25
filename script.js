// Get elements
const usernameInput = document.getElementById('username');
const submitUsernameButton = document.getElementById('submit-username');
const avatarContainer = document.getElementById('avatar-container');
const joinGameButton = document.getElementById('join-game');
const hostGameButton = document.getElementById('host-game');
const gameContainer = document.getElementById('game-container');

// Set up event listeners
submitUsernameButton.addEventListener('click', handleUsernameSubmit);
joinGameButton.addEventListener('click', handleJoinGame);
hostGameButton.addEventListener('click', handleHostGame);

// Handle username submission
function handleUsernameSubmit() {
    const username = usernameInput.value.trim();
    if (username) {
        // Send request to server to join or host game
    } else {
        alert('Please enter a username');
    }
}

// Handle join game button click
function handleJoinGame() {
    // Prompt user for lobby code
    const lobbyCode = prompt('Enter lobby code:');
    if (lobbyCode) {
        // Send request to server to join game
    } else {
        alert('Please enter a lobby code');
    }
}

// Handle host game button click
function handleHostGame() {
    // Send request to server to host game
}
