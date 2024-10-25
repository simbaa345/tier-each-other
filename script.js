// Initialize game logic
const gameContainer = document.getElementById('game-container');

// Load game components
import Lobby from './components/Lobby.js';
import Game from './components/Game.js';
import Leaderboard from './components/Leaderboard.js';

// Set up game routes
import { setupRoutes } from './routes.js';

setupRoutes(gameContainer);
