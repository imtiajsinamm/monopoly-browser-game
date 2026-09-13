// Monopoly Board Configuration
const BOARD_CONFIG = [
    { name: 'GO', price: 0, color: 'special', type: 'corner', rent: 0 },
    { name: 'Mediterranean Ave', price: 60, color: '#8B4513', type: 'street', rent: 2 },
    { name: 'Community Chest', price: 0, color: 'special', type: 'card', rent: 0 },
    { name: 'Baltic Ave', price: 60, color: '#8B4513', type: 'street', rent: 4 },
    { name: 'Income Tax', price: 0, color: 'special', type: 'tax', rent: 0 },
    { name: 'Reading Railroad', price: 200, color: '#333', type: 'railroad', rent: 25 },
    { name: 'Oriental Ave', price: 100, color: '#87CEEB', type: 'street', rent: 6 },
    { name: 'Chance', price: 0, color: 'special', type: 'card', rent: 0 },
    { name: 'Vermont Ave', price: 100, color: '#87CEEB', type: 'street', rent: 6 },
    { name: 'Connecticut Ave', price: 120, color: '#87CEEB', type: 'street', rent: 8 },
    { name: 'Just Visiting', price: 0, color: 'special', type: 'corner', rent: 0 },
    { name: 'St Charles Pl', price: 140, color: '#FF69B4', type: 'street', rent: 10 },
    { name: 'Electric Co', price: 150, color: 'utility', type: 'utility', rent: 0 },
    { name: 'States Ave', price: 140, color: '#FF69B4', type: 'street', rent: 10 },
    { name: 'Virginia Ave', price: 160, color: '#FF69B4', type: 'street', rent: 12 },
    { name: 'PA Railroad', price: 200, color: '#333', type: 'railroad', rent: 25 },
    { name: 'St James Pl', price: 180, color: '#FF8C00', type: 'street', rent: 14 },
    { name: 'Community Chest', price: 0, color: 'special', type: 'card', rent: 0 },
    { name: 'Tennessee Ave', price: 180, color: '#FF8C00', type: 'street', rent: 14 },
    { name: 'New York Ave', price: 200, color: '#FF8C00', type: 'street', rent: 16 },
    { name: 'Free Parking', price: 0, color: 'special', type: 'corner', rent: 0 },
    { name: 'Kentucky Ave', price: 220, color: '#FF0000', type: 'street', rent: 18 },
    { name: 'Chance', price: 0, color: 'special', type: 'card', rent: 0 },
    { name: 'Indiana Ave', price: 220, color: '#FF0000', type: 'street', rent: 18 },
    { name: 'Illinois Ave', price: 240, color: '#FF0000', type: 'street', rent: 20 },
    { name: 'B&O Railroad', price: 200, color: '#333', type: 'railroad', rent: 25 },
    { name: 'Atlantic Ave', price: 260, color: '#FFFF00', type: 'street', rent: 22 },
    { name: 'Ventnor Ave', price: 260, color: '#FFFF00', type: 'street', rent: 22 },
    { name: 'Water Works', price: 150, color: 'utility', type: 'utility', rent: 0 },
    { name: 'Marvin Gardens', price: 280, color: '#FFFF00', type: 'street', rent: 24 },
    { name: 'Go to Jail', price: 0, color: 'special', type: 'corner', rent: 0 },
    { name: 'Pacific Ave', price: 300, color: '#00AA00', type: 'street', rent: 26 },
    { name: 'NC Ave', price: 300, color: '#00AA00', type: 'street', rent: 26 },
    { name: 'Community Chest', price: 0, color: 'special', type: 'card', rent: 0 },
    { name: 'Pennsylvania Ave', price: 320, color: '#00AA00', type: 'street', rent: 28 },
    { name: 'Short Line', price: 200, color: '#333', type: 'railroad', rent: 25 },
    { name: 'Chance', price: 0, color: 'special', type: 'card', rent: 0 },
    { name: 'Park Place', price: 350, color: '#0000FF', type: 'street', rent: 35 },
    { name: 'Luxury Tax', price: 0, color: 'special', type: 'tax', rent: 0 },
    { name: 'Boardwalk', price: 400, color: '#0000FF', type: 'street', rent: 50 }
];

const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#C7CEEA', '#FF9999'];

class BoardRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.boardSize = Math.min(this.canvas.width, this.canvas.height);
        this.spaceSize = this.boardSize / 11;
        this.players = {};
        this.selectedProperty = null;
        this.diceAnimation = null;
    }

    drawBoard() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.drawSpaces();
        this.drawPlayers();
        this.drawCenterText();
    }

    drawBackground() {
        // Board background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(this.spaceSize, this.spaceSize, 
                         this.boardSize - 2 * this.spaceSize, 
                         this.boardSize - 2 * this.spaceSize);
        
        // Border
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(this.spaceSize, this.spaceSize, 
                           this.boardSize - 2 * this.spaceSize, 
                           this.boardSize - 2 * this.spaceSize);
    }

    drawSpaces() {
        for (let i = 0; i < 40; i++) {
            this.drawSpace(i);
        }
    }

    drawSpace(index) {
        const pos = this.getSpacePosition(index);
        const property = BOARD_CONFIG[index];
        const size = this.spaceSize * 0.9;

        // Draw background
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(pos.x, pos.y, size, size);

        // Draw border
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(pos.x, pos.y, size, size);

        // Draw color bar for properties
        if (property.type === 'street') {
            this.ctx.fillStyle = property.color;
            const barHeight = size * 0.15;
            this.ctx.fillRect(pos.x, pos.y, size, barHeight);
        }

        // Draw name
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const nameY = property.type === 'corner' ? pos.y + size / 2 : pos.y + size / 2;
        this.ctx.fillText(property.name, pos.x + size / 2, nameY, size - 4);

        // Draw price for properties
        if (property.price > 0 && property.type !== 'railroad') {
            this.ctx.font = '8px Arial';
            this.ctx.fillText(`$${property.price}`, pos.x + size / 2, nameY + 12, size - 4);
        }
    }

    getSpacePosition(index) {
        const s = this.spaceSize;
        const edge = this.boardSize - s;

        // Bottom row (0-9)
        if (index >= 0 && index <= 9) {
            return { x: edge - index * s, y: edge };
        }
        // Right column (10-19)
        else if (index >= 10 && index <= 19) {
            return { x: s, y: edge - (index - 10) * s };
        }
        // Top row (20-29)
        else if (index >= 20 && index <= 29) {
            return { x: s + (index - 20) * s, y: s };
        }
        // Left column (30-39)
        else {
            return { x: edge, y: s + (index - 30) * s };
        }
    }

    drawPlayers() {
        for (const [playerName, playerData] of Object.entries(this.players)) {
            this.drawPlayerToken(playerName, playerData);
        }
    }

    drawPlayerToken(playerName, playerData) {
        const pos = this.getSpacePosition(playerData.position);
        const tokenSize = this.spaceSize * 0.25;
        
        // Get player color from index
        const color = PLAYER_COLORS[playerData.colorIndex] || '#999';
        
        // Draw circle
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(
            pos.x + this.spaceSize * 0.6,
            pos.y + this.spaceSize * 0.6,
            tokenSize,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Draw border
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw initial
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            playerName[0].toUpperCase(),
            pos.x + this.spaceSize * 0.6,
            pos.y + this.spaceSize * 0.6
        );
    }

    drawCenterText() {
        const centerX = this.boardSize / 2;
        const centerY = this.boardSize / 2;
        
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('MONOPOLY', centerX, centerY - 30);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#666';
        this.ctx.fillText('LAN Game', centerX, centerY + 20);
    }

    setPlayers(players, colorIndexes = {}) {
        this.players = {};
        players.forEach((player, idx) => {
            this.players[player.name] = {
                position: player.position || 0,
                money: player.money || 1500,
                colorIndex: colorIndexes[player.name] || idx
            };
        });
        this.drawBoard();
    }

    animatePlayerMovement(playerName, fromPosition, toPosition, duration = 1000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const startPos = fromPosition;
            const endPos = toPosition;
            
            const animate = () => {
                const currentTime = Date.now() - startTime;
                const progress = Math.min(currentTime / duration, 1);
                
                // Easing function (ease-out)
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                // Interpolate position
                const currentPosition = Math.round(startPos + (endPos - startPos) * easeProgress);
                this.players[playerName].position = currentPosition;
                this.drawBoard();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.players[playerName].position = endPos;
                    this.drawBoard();
                    resolve();
                }
            };
            
            animate();
        });
    }

    animateDiceRoll(duration = 1000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const die1Rolls = [];
            const die2Rolls = [];
            
            // Generate random values
            for (let i = 0; i < 20; i++) {
                die1Rolls.push(Math.floor(Math.random() * 6) + 1);
                die2Rolls.push(Math.floor(Math.random() * 6) + 1);
            }
            
            const finalDie1 = Math.floor(Math.random() * 6) + 1;
            const finalDie2 = Math.floor(Math.random() * 6) + 1;
            
            const animate = () => {
                const currentTime = Date.now() - startTime;
                const progress = Math.min(currentTime / duration, 1);
                const rollIndex = Math.floor(progress * die1Rolls.length);
                
                this.diceAnimation = {
                    die1: rollIndex < die1Rolls.length ? die1Rolls[rollIndex] : finalDie1,
                    die2: rollIndex < die2Rolls.length ? die2Rolls[rollIndex] : finalDie2,
                    rolling: progress < 1
                };
                
                this.drawDice();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.diceAnimation = {
                        die1: finalDie1,
                        die2: finalDie2,
                        rolling: false
                    };
                    this.drawDice();
                    resolve({ die1: finalDie1, die2: finalDie2 });
                }
            };
            
            animate();
        });
    }

    drawDice() {
        if (!this.diceAnimation) return;
        
        const diceX = 50;
        const diceY = 50;
        const diceSize = 40;
        const gap = 20;
        
        // Draw dice 1
        this.drawDieFace(diceX, diceY, diceSize, this.diceAnimation.die1);
        
        // Draw dice 2
        this.drawDieFace(diceX + diceSize + gap, diceY, diceSize, this.diceAnimation.die2);
        
        // Draw label
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`Total: ${this.diceAnimation.die1 + this.diceAnimation.die2}`, 
                          diceX, diceY + diceSize + 30);
    }

    drawDieFace(x, y, size, value) {
        // Draw die background
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x, y, size, size);
        
        // Draw die border
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, size, size);
        
        // Draw dots
        this.ctx.fillStyle = '#333';
        const dotSize = size * 0.08;
        const dotPositions = {
            1: [[0.5, 0.5]],
            2: [[0.25, 0.25], [0.75, 0.75]],
            3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
            4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
            5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
            6: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.5], [0.75, 0.5], [0.25, 0.75], [0.75, 0.75]]
        };
        
        const positions = dotPositions[value] || [];
        positions.forEach(([px, py]) => {
            this.ctx.beginPath();
            this.ctx.arc(x + px * size, y + py * size, dotSize, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    showPropertyInfo(index) {
        return BOARD_CONFIG[index];
    }
}

// Export for use in game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BoardRenderer, BOARD_CONFIG, PLAYER_COLORS };
}
