const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Game state
const ROOMS = {};

class GameRoom {
  constructor(roomCode, hostName, maxPlayers = 6) {
    this.roomCode = roomCode;
    this.hostName = hostName;
    this.maxPlayers = maxPlayers;
    this.players = {}; // playerName -> {name, socketId, ready}
    this.gameStarted = false;
    this.gameState = null;
  }

  addPlayer(playerName, socketId) {
    if (Object.keys(this.players).length >= this.maxPlayers) {
      return false;
    }
    this.players[playerName] = {
      name: playerName,
      socketId,
      ready: false
    };
    return true;
  }

  removePlayer(playerName) {
    delete this.players[playerName];
  }

  getPlayersList() {
    return Object.values(this.players).map(p => ({
      name: p.name,
      ready: p.ready,
      isHost: p.name === this.hostName
    }));
  }

  isFull() {
    return Object.keys(this.players).length >= this.maxPlayers;
  }

  canStart() {
    return Object.keys(this.players).length >= 2 && 
           Object.values(this.players).every(p => p.ready);
  }

  startGame() {
    if (!this.canStart()) return false;
    
    const playerNames = Object.values(this.players).map(p => p.name);
    this.gameState = {
      currentPlayer: 0,
      players: playerNames.map(name => ({
        name,
        money: 1500,
        position: 0,
        properties: [],
        inJail: false
      })),
      gameStarted: true,
      turn: 0
    };
    this.gameStarted = true;
    return true;
  }
}

function generateRoomCode(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getRoom(roomCode) {
  return ROOMS[roomCode];
}

// Socket.IO Events
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.emit('connection_response', {
    status: 'connected',
    message: 'Connected to Monopoly server',
    socketId: socket.id
  });

  // Create Room
  socket.on('create_room', (data) => {
    const playerName = data.playerName || 'Player';
    
    let roomCode = generateRoomCode();
    while (ROOMS[roomCode]) {
      roomCode = generateRoomCode();
    }

    const room = new GameRoom(roomCode, playerName);
    room.addPlayer(playerName, socket.id);
    ROOMS[roomCode] = room;
    
    socket.join(roomCode);
    socket.playerName = playerName;
    socket.roomCode = roomCode;

    console.log(`Room created: ${roomCode} by ${playerName}`);

    socket.emit('room_created', {
      status: 'success',
      roomCode,
      message: `Room created! Share code ${roomCode} with friends`,
      players: room.getPlayersList()
    });
  });

  // Join Room
  socket.on('join_room', (data) => {
    const roomCode = (data.roomCode || '').toUpperCase();
    const playerName = data.playerName || 'Player';
    
    const room = getRoom(roomCode);

    if (!room) {
      socket.emit('join_room_error', {
        status: 'error',
        message: `Room ${roomCode} not found`
      });
      return;
    }

    if (room.gameStarted) {
      socket.emit('join_room_error', {
        status: 'error',
        message: 'Game already started in this room'
      });
      return;
    }

    if (room.isFull()) {
      socket.emit('join_room_error', {
        status: 'error',
        message: `Room is full (max ${room.maxPlayers} players)`
      });
      return;
    }

    room.addPlayer(playerName, socket.id);
    socket.join(roomCode);
    socket.playerName = playerName;
    socket.roomCode = roomCode;

    console.log(`Player ${playerName} joined room ${roomCode}`);

    io.to(roomCode).emit('player_joined', {
      playerName,
      players: room.getPlayersList(),
      roomCode
    });
  });

  // Set Ready Status
  socket.on('set_ready', (data) => {
    const room = getRoom(socket.roomCode);
    if (!room) return;

    if (room.players[socket.playerName]) {
      room.players[socket.playerName].ready = data.ready;
      
      io.to(socket.roomCode).emit('room_updated', {
        players: room.getPlayersList(),
        canStart: room.canStart()
      });
    }
  });

  // Start Game
  socket.on('start_game', (data) => {
    const room = getRoom(socket.roomCode);
    if (!room) return;

    if (socket.playerName !== room.hostName) {
      socket.emit('start_game_error', {
        message: 'Only host can start the game'
      });
      return;
    }

    if (!room.canStart()) {
      socket.emit('start_game_error', {
        message: 'Not all players are ready'
      });
      return;
    }

    if (room.startGame()) {
      console.log(`Game started in room ${socket.roomCode}`);
      io.to(socket.roomCode).emit('game_started', {
        status: 'success',
        gameState: room.gameState
      });
    }
  });

  // Roll Dice
  socket.on('roll_dice', (data) => {
    const room = getRoom(socket.roomCode);
    if (!room || !room.gameStarted) return;

    const currentPlayer = room.gameState.players[room.gameState.currentPlayer];
    if (currentPlayer.name !== socket.playerName) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }

    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const total = die1 + die2;
    const isDoubles = die1 === die2;

    io.to(socket.roomCode).emit('dice_rolled', {
      player: socket.playerName,
      die1,
      die2,
      total,
      isDoubles
    });
  });

  // Move Player
  socket.on('move_player', (data) => {
    const room = getRoom(socket.roomCode);
    if (!room || !room.gameStarted) return;

    const spaces = data.spaces;
    const currentPlayer = room.gameState.players[room.gameState.currentPlayer];
    
    currentPlayer.position = (currentPlayer.position + spaces) % 40;
    
    // Check if passed GO
    if (currentPlayer.position < spaces) {
      currentPlayer.money += 200;
    }

    io.to(socket.roomCode).emit('game_state_update', {
      gameState: room.gameState
    });
  });

  // End Turn
  socket.on('end_turn', (data) => {
    const room = getRoom(socket.roomCode);
    if (!room || !room.gameStarted) return;

    room.gameState.currentPlayer = (room.gameState.currentPlayer + 1) % room.gameState.players.length;
    room.gameState.turn++;

    io.to(socket.roomCode).emit('game_state_update', {
      gameState: room.gameState,
      turnEnded: true
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);

    if (socket.roomCode && socket.playerName) {
      const room = getRoom(socket.roomCode);
      if (room) {
        room.removePlayer(socket.playerName);
        
        io.to(socket.roomCode).emit('player_left', {
          playerName: socket.playerName,
          players: room.getPlayersList()
        });

        // Delete room if empty
        if (Object.keys(room.players).length === 0) {
          delete ROOMS[socket.roomCode];
          console.log(`Room ${socket.roomCode} deleted (empty)`);
        }
      }
    }
  });
});

// HTTP Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/rooms', (req, res) => {
  const roomsList = Object.entries(ROOMS)
    .filter(([_, room]) => !room.gameStarted)
    .map(([code, room]) => ({
      code,
      host: room.hostName,
      players: Object.keys(room.players).length,
      maxPlayers: room.maxPlayers
    }));
  
  res.json({ rooms: roomsList });
});

app.get('/api/room/:roomCode', (req, res) => {
  const room = getRoom(req.params.roomCode.toUpperCase());
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.json({
    roomCode: room.roomCode,
    host: room.hostName,
    players: room.getPlayersList(),
    gameStarted: room.gameStarted,
    canStart: room.canStart()
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log('Monopoly Browser Game - Server');
  console.log('='.repeat(60));
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Open your browser and go to http://localhost:${PORT}`);
  console.log(`For LAN: http://<your-ip>:${PORT}`);
  console.log('='.repeat(60) + '\n');
});
