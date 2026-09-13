// Game Client
const socket = io();

let gameState = {
    playerName: '',
    roomCode: '',
    isHost: false,
    isReady: false,
    gameStarted: false
};

// DOM Elements
const screens = {
    mainMenu: document.getElementById('mainMenu'),
    joinRoomMenu: document.getElementById('joinRoomMenu'),
    lobby: document.getElementById('lobby'),
    gameBoard: document.getElementById('gameBoard')
};

const inputs = {
    playerName: document.getElementById('playerNameInput'),
    roomCode: document.getElementById('roomCodeInput')
};

const buttons = {
    createRoom: document.getElementById('createRoomBtn'),
    joinRoom: document.getElementById('joinRoomBtn'),
    joinRoomConfirm: document.getElementById('joinRoomConfirmBtn'),
    backToMain: document.getElementById('backToMainBtn'),
    ready: document.getElementById('readyBtn'),
    startGame: document.getElementById('startGameBtn'),
    rollDice: document.getElementById('rollDiceBtn'),
    endTurn: document.getElementById('endTurnBtn')
};

// Screen Management
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    }
}

// Event Listeners
buttons.createRoom.addEventListener('click', () => {
    const name = inputs.playerName.value.trim();
    if (!name) {
        alert('Please enter your name');
        return;
    }
    gameState.playerName = name;
    socket.emit('create_room', { playerName: name });
});

buttons.joinRoom.addEventListener('click', () => {
    const name = inputs.playerName.value.trim();
    if (!name) {
        alert('Please enter your name');
        return;
    }
    gameState.playerName = name;
    showScreen('joinRoomMenu');
});

buttons.joinRoomConfirm.addEventListener('click', () => {
    const code = inputs.roomCode.value.trim().toUpperCase();
    if (!code) {
        alert('Please enter a room code');
        return;
    }
    socket.emit('join_room', {
        roomCode: code,
        playerName: gameState.playerName
    });
});

buttons.backToMain.addEventListener('click', () => {
    inputs.roomCode.value = '';
    showScreen('mainMenu');
});

buttons.ready.addEventListener('click', () => {
    gameState.isReady = !gameState.isReady;
    socket.emit('set_ready', {
        roomCode: gameState.roomCode,
        playerName: gameState.playerName,
        ready: gameState.isReady
    });
    buttons.ready.textContent = gameState.isReady ? '✓ Ready' : "I'm Ready!";
    buttons.ready.classList.toggle('ready', gameState.isReady);
});

buttons.startGame.addEventListener('click', () => {
    socket.emit('start_game', {
        roomCode: gameState.roomCode,
        playerName: gameState.playerName
    });
});

buttons.rollDice.addEventListener('click', () => {
    socket.emit('roll_dice', {
        roomCode: gameState.roomCode,
        playerName: gameState.playerName
    });
});

buttons.endTurn.addEventListener('click', () => {
    socket.emit('end_turn', {
        roomCode: gameState.roomCode,
        playerName: gameState.playerName
    });
});

// Socket Events
socket.on('connection_response', (data) => {
    console.log('Connected to server:', data);
});

socket.on('room_created', (data) => {
    console.log('Room created:', data);
    gameState.roomCode = data.roomCode;
    gameState.isHost = true;
    updateLobby(data);
    showScreen('lobby');
});

socket.on('join_room_error', (data) => {
    alert('Error: ' + data.message);
    inputs.roomCode.value = '';
});

socket.on('player_joined', (data) => {
    console.log('Player joined:', data.playerName);
    updateLobby(data);
});

socket.on('room_updated', (data) => {
    console.log('Room updated:', data);
    updateLobby(data);
    
    // Enable start button if host and game can start
    if (gameState.isHost) {
        buttons.startGame.disabled = !data.canStart;
    }
});

socket.on('player_left', (data) => {
    console.log('Player left:', data.playerName);
    updateLobby(data);
});

socket.on('game_started', (data) => {
    console.log('Game started!', data.gameState);
    gameState.gameStarted = true;
    updateGameBoard(data.gameState);
    showScreen('gameBoard');
});

socket.on('dice_rolled', (data) => {
    console.log('Dice rolled:', data);
    const result = `${data.die1} + ${data.die2} = ${data.total}`;
    document.getElementById('diceValue').textContent = result;
    document.getElementById('diceResult').style.display = 'block';
    
    if (data.isDoubles) {
        alert(`${data.player} rolled doubles!`);
    }
});

socket.on('game_state_update', (data) => {
    console.log('Game state updated:', data.gameState);
    updateGameBoard(data.gameState);
});

// UI Update Functions
function updateLobby(data) {
    // Update room code display
    document.getElementById('roomCodeDisplay').textContent = gameState.roomCode || data.roomCode;
    document.getElementById('shareCode').textContent = gameState.roomCode || data.roomCode;
    
    // Update player status
    const status = gameState.isReady ? '✓ Ready' : '⏳ Not Ready';
    document.getElementById('playerStatus').textContent = `Your Status: ${status}`;
    
    // Update players list
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    data.players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-item';
        
        let badges = '';
        if (player.isHost) {
            badges += '<span class="player-badge player-host">HOST</span> ';
        }
        if (player.ready) {
            badges += '<span class="player-badge player-ready">READY</span>';
        }
        
        playerDiv.innerHTML = `
            <span class="player-name">${player.name}</span>
            <div>${badges}</div>
        `;
        playersList.appendChild(playerDiv);
    });
}

function updateGameBoard(gameState) {
    // Update current player
    const currentPlayer = gameState.players[gameState.currentPlayer];
    document.getElementById('currentPlayerDisplay').textContent = `Current Player: ${currentPlayer.name}`;
    
    // Update players info
    const playersList = document.getElementById('gamePlayersList');
    playersList.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'game-player-item';
        if (index === gameState.currentPlayer) {
            playerDiv.style.background = '#fff3cd';
            playerDiv.style.borderLeft = '4px solid #667eea';
        }
        
        playerDiv.innerHTML = `
            <div class="game-player-name">${player.name}</div>
            <div class="game-player-stats">
                💰 $${player.money} | 📍 ${player.position}
            </div>
        `;
        playersList.appendChild(playerDiv);
    });
    
    // Update button states
    const isCurrentPlayer = gameState.players[gameState.currentPlayer].name === gameState.playerName;
    buttons.rollDice.disabled = !isCurrentPlayer;
    buttons.endTurn.disabled = !isCurrentPlayer;
}

// Initialize
console.log('Monopoly Browser Game Loaded');
showScreen('mainMenu');
