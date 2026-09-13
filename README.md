# Monopoly Browser Game

A browser-based multiplayer Monopoly game playable over LAN. No installation required - just open in your web browser!

## Features

✨ **Easy to Use**
- No Python or installation required
- Just open a web browser
- Create or join rooms with room codes
- Play with friends on the same LAN

🎮 **Multiplayer**
- Support for 2-6 players
- Real-time game synchronization
- Room-based lobby system
- Ready status management

🏠 **Room System**
- Host creates a room → gets a room code
- Other players join using the room code
- Easy sharing - no need to know IP addresses
- Automatic room cleanup when empty

## Quick Start

### Prerequisites
- Node.js (v14 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/monopoly-browser-game.git
cd monopoly-browser-game

# Install dependencies
npm install

# Start the server
npm start
```

The server will start on `http://localhost:3000`

### Playing on LAN

1. **Start the server** on one computer
2. **Find your IP address**:
   - Windows: Run `ipconfig` and look for IPv4 Address
   - Mac/Linux: Run `ifconfig` and look for inet address
3. **Share the URL** with players: `http://<your-ip>:3000`
4. Each player opens the URL in their browser
5. Enter name and create/join a room

## How to Play

### Game Flow

1. **Main Menu**
   - Enter your player name
   - Create a new room or join an existing one

2. **Room Code**
   - Host gets a unique room code (e.g., `A7K2X`)
   - Share this with friends

3. **Lobby**
   - Wait for players to join
   - Click "I'm Ready!" when ready to play
   - Host clicks "Start Game" when all are ready

4. **Game**
   - Roll dice and move around the board
   - Buy properties, collect rent, build houses
   - Last player with money wins!

## Game Rules

- Each player starts with **$1,500**
- Roll two dice to move around the board
- Buy unowned properties you land on
- Pay rent when landing on opponents' properties
- Pass GO to collect $200 salary
- Build houses and hotels to increase rent
- Last player with money wins

## Project Structure

```
monopoly-browser-game/
├── package.json          # Dependencies
├── server.js             # Node.js backend server
└── public/
    ├── index.html        # Main HTML file
    ├── styles.css        # Styling
    └── game.js           # Frontend game logic
```

## API Endpoints

### HTTP Routes
- `GET /` - Main game page
- `GET /api/rooms` - List available rooms
- `GET /api/room/:roomCode` - Get room info

### Socket.IO Events

**Client → Server**
- `create_room` - Create a new room
- `join_room` - Join existing room
- `set_ready` - Set ready status
- `start_game` - Start the game (host only)
- `roll_dice` - Roll dice
- `move_player` - Move player on board
- `end_turn` - End current turn

**Server → Client**
- `connection_response` - Initial connection
- `room_created` - Room created successfully
- `player_joined` - Player joined room
- `room_updated` - Room state updated
- `game_started` - Game started
- `dice_rolled` - Dice roll result
- `game_state_update` - Game state changed
- `player_left` - Player disconnected

## Troubleshooting

### Players can't connect to server
1. Check firewall - allow port 3000
2. Verify all PCs are on same LAN
3. Use correct IP address (not localhost)
4. Restart server and try again

### Connection drops
- Check network stability
- Firewall might be blocking WebSocket
- Try restarting browser and server

### Room code not found
- Room code is case-insensitive but must be exact
- Server might have restarted - create new room
- Make sure you copied the code correctly

## Development

For development with auto-reload:

```bash
npm run dev
```

This requires `nodemon` to be installed.

## Future Enhancements

- [ ] Visual board with property cards
- [ ] Auction system for properties
- [ ] Trading between players
- [ ] Chance and Community Chest cards
- [ ] House/hotel building UI
- [ ] Chat system in lobby
- [ ] Game statistics and replays
- [ ] Mobile-friendly interface
- [ ] Docker deployment

## License

MIT License - See LICENSE file for details

## Contributing

Feel free to submit issues and pull requests!
