# 🎮 Monopoly Browser Game - Quick Start

## 🚀 Get Started in 5 Minutes

### Step 1: Install Node.js
Download and install from https://nodejs.org/ (version 14+)

### Step 2: Clone Repository
```bash
git clone https://github.com/imtiajsinamm/monopoly-browser-game.git
cd monopoly-browser-game
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start Server
```bash
npm start
```

You should see:
```
============================================================
Monopoly Browser Game - Server
============================================================
Server running on http://localhost:3000
Open your browser and go to http://localhost:3000
For LAN: http://<your-ip>:3000
============================================================
```

### Step 5: Open in Browser
- **Single PC**: Go to `http://localhost:3000`
- **LAN**: Go to `http://<server-ip>:3000` (replace with your server's IP)

## 🎯 How to Play

### 1. Main Menu
```
┌─────────────────────────┐
│      MONOPOLY           │
│      LAN Game           │
│                         │
│  [Enter Name]           │
│                         │
│ [Create Room][Join]     │
└─────────────────────────┘
```
- Enter your player name
- Click **Create Room** to host (get room code)
- Click **Join** to join existing room

### 2. Create/Join Room
**Creating a Room:**
- You become the HOST
- You get a room code (e.g., `A7K2X`)
- Share this code with friends

**Joining a Room:**
- Enter the room code
- Wait for host to start game

### 3. Lobby
```
┌─────────────────────────┐
│  Room: A7K2X            │
│                         │
│  Players:               │
│  ✓ Alice (HOST)         │
│  ○ Bob                  │
│                         │
│ [I'm Ready!][Start]     │
└─────────────────────────┘
```
- Click "I'm Ready!" when you're ready
- Host clicks "Start Game" when all ready

### 4. Play Game
```
┌──────────────────┐  ┌──────────────┐
│     BOARD        │  │ Players Info │
│  [Game Board]    │  │ • Alice $1500│
│                  │  │ • Bob $1500  │
│                  │  │              │
│                  │  │ [Roll Dice]  │
│                  │  │ [End Turn]   │
└──────────────────┘  └──────────────┘
```
- Click "Roll Dice" to roll
- Move around the board
- Buy properties, pay rent
- Last player with money wins!

## 🖥️ Finding Your IP Address

### Windows
1. Open Command Prompt
2. Type: `ipconfig`
3. Look for "IPv4 Address" (e.g., `192.168.1.100`)
4. Share: `http://192.168.1.100:3000`

### Mac
1. Open Terminal
2. Type: `ifconfig`
3. Look for "inet" under your network (e.g., `192.168.1.100`)
4. Share: `http://192.168.1.100:3000`

### Linux
1. Open Terminal
2. Type: `hostname -I`
3. Use the IP shown (e.g., `192.168.1.100`)
4. Share: `http://192.168.1.100:3000`

## 🎮 Single PC Testing

Test with multiple browsers/tabs on the same PC:

```bash
# Terminal 1
npm start

# Then open these in browser:
# Tab 1: http://localhost:3000  (Player 1)
# Tab 2: http://localhost:3000  (Player 2)
# Tab 3: http://localhost:3000  (Player 3)
```

## ⚠️ Troubleshooting

### "Cannot find module 'express'"
- Run: `npm install`

### "Port 3000 already in use"
- Change port in code: `const PORT = 3001`
- Or kill process using port 3000

### Players can't connect to server
1. Check firewall allows port 3000
2. Verify all PCs on same WiFi/network
3. Use correct IP (run `ipconfig`)
4. Restart server

### "Room not found" when joining
- Copy room code exactly (case doesn't matter)
- Make sure host is still connected
- Try creating new room

## 🔧 Customization

### Change Port
Edit `server.js` line with `const PORT = 3000`:
```javascript
const PORT = process.env.PORT || 3000; // Change 3000 to any port
```

### Change Max Players per Room
Edit `server.js` in GameRoom class:
```javascript
const maxPlayers = 6; // Change to desired number
```

## 📱 Browser Compatibility
- Chrome ✓
- Firefox ✓
- Safari ✓
- Edge ✓
- Mobile browsers ✓ (experimental)

## 🎲 Game Rules Reminder

| Action | What Happens |
|--------|---------------|
| Start | Each player gets $1,500 |
| Roll Dice | Move that many spaces |
| Buy Property | Own it & collect rent from others |
| Pass GO | Collect $200 |
| Land on Property | Pay rent if owned |
| Bankrupt | When money reaches 0 |
| Win | Last player with money |

## 🆘 Need Help?

1. Check the main `README.md` for detailed docs
2. Check `TROUBLESHOOTING.md` for common issues
3. Review game code in `public/game.js`
4. Check server logs in terminal

## 🎉 Ready?

```bash
npm start
```

Then visit: `http://localhost:3000`

Have fun! 🎮🎲
