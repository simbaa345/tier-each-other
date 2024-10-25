// Get elements
const gameContainer = document.getElementById('game-container');
const categoryDisplay = document.getElementById('category-display');
const itemContainer = document.getElementById('item-container');
const tierListContainer = document.getElementById('tier-list-container');
const submitButton = document.getElementById('submit-button');
const timerDisplay = document.getElementById('timer-display');

// Set up game variables
let category;
let items;
let tierList;
let timer;

// Set up event listeners
submitButton.addEventListener('click', handleSubmitTierList);

// Function to render game interface
function renderGameInterface() {
    // Display category
    categoryDisplay.innerText = category;

    // Render items
    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.innerText = item;
        itemElement.dataset.itemIndex = index;
        itemElement.classList.add('item');
        itemContainer.appendChild(itemElement);
    });

    // Render tier list
    tierList.forEach((tier, index) => {
        const tierElement = document.createElement('div');
        tierElement.innerText = tier.name;
        tierElement.dataset.tierIndex = index;
        tierElement.classList.add('tier');
        tierListContainer.appendChild(tierElement);
    });

    // Set up drag-and-drop functionality
    const itemsArray = Array.from(itemContainer.children);
    itemsArray.forEach((item) => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('itemIndex', item.dataset.itemIndex);
        });
    });

    const tiersArray = Array.from(tierListContainer.children);
    tiersArray.forEach((tier) => {
        tier.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        tier.addEventListener('drop', (e) => {
            const itemIndex = e.dataTransfer.getData('itemIndex');
            const tierIndex = tier.dataset.tierIndex;
            updateTierList(itemIndex, tierIndex);
        });
    });
}

// Function to update tier list
function updateTierList(itemIndex, tierIndex) {
    tierList[tierIndex].items.push(items[itemIndex]);
    items.splice(itemIndex, 1);
    renderGameInterface();
}

// Function to handle tier list submission
function handleSubmitTierList() {
    // Send tier list to server
    socket.emit('submit-tier-list', tierList);
}

// Function to start game timer
function startGameTimer() {
    timer = 120; // 2 minutes
    timerDisplay.innerText = `Time remaining: ${timer} seconds`;
    const intervalId = setInterval(() => {
        timer -= 1;
        timerDisplay.innerText = `Time remaining: ${timer} seconds`;
        if (timer === 0) {
            clearInterval(intervalId);
            handleSubmitTierList();
        }
    }, 1000);
}

// Set up socket events
socket.on('start-game', (data) => {
    category = data.category;
    items = data.items;
    tierList = data.tierList;
    renderGameInterface();
    startGameTimer();
});

socket.on('game-results', (data) => {
    // Display game results
    const resultsElement = document.createElement('div');
    resultsElement.innerText = `Your score: ${data.score}`;
    gameContainer.appendChild(resultsElement);
});
