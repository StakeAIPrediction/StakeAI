(function () {
    'use strict';

    // Configuration
    const betButtonSelector = '[data-testid="bet-button"]';
    const tileSelector = '[data-test="mines-tile"]';
    const cashoutButtonSelector = '[data-testid="cashout-button"]';
    const retryDelay = 2000;
    const clickDelay = 1000;
    let maxClicks = 8;
    const initialWaitTime = 10000;

    // Tile history: Tracks bombs and clicks for each tile
    const tileHistory = new Map();
 // Make an element draggable
    function makeDraggable(element) {
        element.style.cursor = 'move';

        let offsetX = 0, offsetY = 0, isDragging = false;

        element.addEventListener('mousedown', (event) => {
            isDragging = true;
            offsetX = event.clientX - element.getBoundingClientRect().left;
            offsetY = event.clientY - element.getBoundingClientRect().top;

            // Bring the dragged element to the front
            element.style.zIndex = '10000';
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const x = event.clientX - offsetX;
                const y = event.clientY - offsetY;

                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    // Create the form UI for user input
// Create the form UI for user input
function createForm() {
        const formContainer = document.createElement('div');
        formContainer.id = 'mines-form-container';
        formContainer.style.position = 'fixed';
        formContainer.style.top = '50%';
        formContainer.style.left = '0';
        formContainer.style.transform = 'translateY(-50%)';
        formContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        formContainer.style.color = '#00FF00';
        formContainer.style.padding = '20px';
        formContainer.style.border = '2px solid #00FF00';
        formContainer.style.borderRadius = '8px';
        formContainer.style.zIndex = '9999';
        formContainer.style.fontFamily = 'monospace';
        formContainer.style.fontSize = '14px';
        formContainer.style.width = '300px';
        formContainer.style.textAlign = 'center';
        formContainer.style.boxSizing = 'border-box';

        const form = document.createElement('form');
        form.id = 'mines-form';

        const betLabel = document.createElement('label');
        betLabel.textContent = 'Bet Amount:';
        const betInput = document.createElement('input');
        betInput.type = 'number';
        betInput.id = 'bet-amount';
        betInput.placeholder = 'Enter bet amount';
        betInput.value = 0;
        betInput.step = '0.01';
        betInput.style.marginBottom = '10px';
        betInput.style.width = '100%';

        const minesLabel = document.createElement('label');
        minesLabel.textContent = 'Mines:';
        const minesSelect = document.createElement('select');
        minesSelect.id = 'mines-count';
        for (let i = 1; i <= 24; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            minesSelect.appendChild(option);
        }
        minesSelect.style.marginBottom = '10px';
        minesSelect.style.width = '100%';

        const startButton = document.createElement('button');
        startButton.type = 'button';
        startButton.textContent = 'Start';
        startButton.style.backgroundColor = '#00FF00';
        startButton.style.border = 'none';
        startButton.style.padding = '10px';
        startButton.style.color = '#000';
        startButton.style.fontSize = '16px';
        startButton.style.width = '100%';
        startButton.style.cursor = 'pointer';
        startButton.addEventListener('click', onStartButtonClick);
        const clicksLabel = document.createElement('label');
clicksLabel.textContent = 'Number of Clicks:';
const clicksInput = document.createElement('input');
clicksInput.type = 'number';
clicksInput.id = 'number-of-clicks';
clicksInput.placeholder = 'Enter number of clicks';
clicksInput.value = 8; // Default value
clicksInput.style.marginBottom = '10px';
clicksInput.style.width = '100%';

form.appendChild(clicksLabel);
form.appendChild(clicksInput);

        form.appendChild(betLabel);
        form.appendChild(betInput);
        form.appendChild(minesLabel);
        form.appendChild(minesSelect);
        form.appendChild(startButton);
        formContainer.appendChild(form);

        document.body.appendChild(formContainer);

        // Make the form draggable
        makeDraggable(formContainer);
         // Create watermark (Stake.prediction) and center it on screen
// Create the watermark (glowing text) as a clickable link
const watermark = document.createElement('a');
watermark.id = 'watermark';
watermark.href = 'https://www.instagram.com/stake.prediction/';  // Link to the Instagram profile
watermark.target = '_blank';  // Open the link in a new tab
watermark.style.position = 'fixed';
watermark.style.top = '50%';
watermark.style.left = '55%';
watermark.style.transform = 'translate(-50%, -50%)';
watermark.style.fontSize = '72px';  // Adjusted font size for readability
watermark.style.fontWeight = 'bold';
watermark.style.color = '#00FF00';  // Classic hacking green
watermark.style.fontFamily = 'monospace';  // Digital/monospaced font for hacking style
watermark.style.whiteSpace = 'nowrap';  // Ensure text doesn't wrap
watermark.style.textAlign = 'center';  // Center the text
watermark.style.animation = 'glow 3s ease-in-out infinite';  // Glow animation for smooth effect

// Keyframes for glowing effect with smooth ease-in-out
const style = document.createElement('style');
style.textContent = `
    @keyframes glow {
        0% { text-shadow: 0 0 0px #00FF00, 0 0 0px #00FF00; }
        50% { text-shadow: 0 0 4px #00FF00, 0 0 8px #00FF00; }
        100% { text-shadow: 0 0 10px #00FF00, 0 0 20px #00FF00; }
    }
`;
document.head.appendChild(style);

watermark.textContent = 'Stake.prediction';
document.body.appendChild(watermark);

// Create the disclaimer (marquee style)
const disclaimerContainer = document.createElement('div');
disclaimerContainer.id = 'disclaimer-container';
disclaimerContainer.style.position = 'fixed';
disclaimerContainer.style.bottom = '10px';  // Place the disclaimer at the bottom
disclaimerContainer.style.left = '50%';
disclaimerContainer.style.transform = 'translateX(-50%)';
disclaimerContainer.style.width = '80%';
disclaimerContainer.style.backgroundColor = '#FF0000';  // Red background
disclaimerContainer.style.border = '2px solid #00FF00';  // Green border for contrast
disclaimerContainer.style.padding = '10px';
disclaimerContainer.style.borderRadius = '8px';  // Rounded corners
disclaimerContainer.style.boxShadow = '0 0 15px #00FF00';  // Glowing shadow effect
disclaimerContainer.style.whiteSpace = 'nowrap';  // Prevent overflow
disclaimerContainer.style.overflow = 'hidden';  // Hide any text that overflows the container

// Disclaimer text content
const disclaimer = document.createElement('div');
disclaimer.textContent = "This is just for educational purposes. Do not guarantee any profit. Gambling is your risk, so we are not responsible for any losses.";
disclaimer.style.fontSize = '18px';
disclaimer.style.color = '#FFFFFF';  // White text color
disclaimer.style.fontFamily = 'monospace';
disclaimer.style.animation = 'scroll 10s linear infinite';  // Scroll the text

disclaimerContainer.appendChild(disclaimer);
document.body.appendChild(disclaimerContainer);

// CSS for scrolling effect (disclaimer)
const scrollStyle = document.createElement('style');
scrollStyle.textContent = `
    @keyframes scroll {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
    }
`;
document.head.appendChild(scrollStyle);


    }


    // Start the game based on user input
     function onStartButtonClick() {
        const betAmount = document.getElementById('bet-amount').value;
        const minesCount = document.getElementById('mines-count').value;
const numberOfClicks = document.getElementById('number-of-clicks').value;
if (numberOfClicks) {
    maxClicks = parseInt(numberOfClicks, 10); // Update maxClicks dynamically
}

        if (betAmount && minesCount) {
            injectValues(betAmount, minesCount);
            log('Starting the game with injected values...', 'info');
            startGame(betAmount, minesCount);
        } else {
            log('Please enter valid values for both bet amount and mines.', 'error');
        }
    }

    // Inject values into the game's elements
    function injectValues(betAmount, minesCount) {
        // Inject bet amount
        const betInputElement = document.querySelector('[data-test="input-game-amount"]');
        if (betInputElement) {
            betInputElement.value = betAmount;
        }

        // Inject mines count
        const minesSelectElement = document.querySelector('[data-test="mines-count"]');
        if (minesSelectElement) {
            minesSelectElement.value = minesCount;  // Set the value of the dropdown
            // Trigger a change event to make sure the game reacts to this change
            const event = new Event('change', { bubbles: true });
            minesSelectElement.dispatchEvent(event);
        }
    }

    // Game flow logic (start clicking bet and tiles)
// Game flow logic (start clicking bet and tiles)
function startGame(betAmount, minesCount) {
    // Example of clicking the bet button to start the round
    clickBetButton();

    function clickBetButton() {
        const betButton = document.querySelector(betButtonSelector);
        if (betButton) {
            log('Starting a new round...', 'info');
            betButton.click();
            setTimeout(() => {
                const tiles = Array.from(document.querySelectorAll(tileSelector));
                clickRandomTiles(tiles);
            }, clickDelay);
        } else {
            log('Bet button not found. Retrying...', 'error');
            setTimeout(clickBetButton, retryDelay);
        }
    }

    function clickRandomTiles(tiles) {
        initializeTileHistory(tiles);
        let clickCount = 0;

        const playRound = () => {
            if (clickCount >= maxClicks) {
                log('Reached maximum clicks. Cashing out...', 'success');
                clickCashoutButton();
                resetGame(); // Reset the game to start a new round
                return;
            }

            const weights = [];
            tileHistory.forEach((data, index) => {
                const { bombs, clicks } = data;
                weights.push({ index, weight: calculateWeight(bombs, clicks) });
            });

            // Normalize weights
            const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
            weights.forEach(w => (w.normalizedWeight = w.weight / totalWeight));

            const random = Math.random();
            let cumulativeWeight = 0;
            let selectedTileIndex = null;

            for (const { index, normalizedWeight } of weights) {
                cumulativeWeight += normalizedWeight;
                if (random <= cumulativeWeight) {
                    selectedTileIndex = index;
                    break;
                }
            }

            if (selectedTileIndex === null || !tiles[selectedTileIndex]) {
                log('No valid tile found. Retrying...', 'error');
                setTimeout(playRound, retryDelay);
                return;
            }

            const tile = tiles[selectedTileIndex];
            log(`Clicking tile #${selectedTileIndex + 1}...`, 'info');
            tile.click();
            clickCount++;

            setTimeout(() => {
                const tileState = tile.className;

                if (tileState.includes('mine')) {
                    log(`Bomb on tile #${selectedTileIndex + 1}! Updating history...`, 'error');
                    tileHistory.get(selectedTileIndex).bombs++;
                    tileHistory.get(selectedTileIndex).clicks++;
                    updateTable();
                    setTimeout(clickBetButton, retryDelay);
                } else if (tileState.includes('gem')) {
                    log(`Gem on tile #${selectedTileIndex + 1}! Continuing...`, 'success');
                    tileHistory.get(selectedTileIndex).clicks++;
                    updateTable();
                    playRound();
                } else {
                    log('Unknown result. Retrying...', 'error');
                    playRound();
                }
            }, clickDelay);
        };

        playRound();
    }
}

// Reset game procedure after max clicks or cashout
function resetGame() {
    // Reset tile history to start fresh
    //tileHistory.clear();
    // Optionally, reset other game-related variables if necessary
    log('Game reset. Starting a new round...', 'info');
    startGame(document.getElementById('bet-amount').value, document.getElementById('mines-count').value);
}


    // Create the on-screen table
     function createTable() {
        const tableContainer = document.createElement('div');
        tableContainer.id = 'mines-table-container';
        tableContainer.style.position = 'fixed';
        tableContainer.style.top = '10px';
        tableContainer.style.right = '10px';
        tableContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        tableContainer.style.color = '#00FF00';
        tableContainer.style.padding = '10px';
        tableContainer.style.border = '2px solid #00FF00';
        tableContainer.style.borderRadius = '8px';
        tableContainer.style.zIndex = '9999';
        tableContainer.style.fontFamily = 'monospace';
        tableContainer.style.fontSize = '12px';
        tableContainer.style.width = '300px';
        tableContainer.style.overflowY = 'auto';
        tableContainer.style.maxHeight = '400px';

        const table = document.createElement('table');
        table.id = 'mines-table';
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        const headerRow = document.createElement('tr');
        ['Tile', 'Bombs', 'Clicks', 'Weight'].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #00FF00';
            th.style.padding = '5px';
            th.style.textAlign = 'center';
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        tableContainer.appendChild(table);
        document.body.appendChild(tableContainer);

        // Make the table draggable
        makeDraggable(tableContainer);
    }


    // Update the table with current tile history
    function updateTable() {
        const table = document.getElementById('mines-table');
        table.innerHTML = '';
        const headerRow = document.createElement('tr');
        ['Tile', 'Bombs', 'Clicks', 'Weight'].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #00FF00';
            th.style.padding = '5px';
            th.style.textAlign = 'center';
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        tileHistory.forEach((data, tileIndex) => {
            const row = document.createElement('tr');
            row.style.backgroundColor = data.bombs > 0 ? '#FF0000' : '#008000';

            const tileCell = document.createElement('td');
            tileCell.textContent = tileIndex + 1;
            row.appendChild(tileCell);

            const bombsCell = document.createElement('td');
            bombsCell.textContent = data.bombs;
            row.appendChild(bombsCell);

            const clicksCell = document.createElement('td');
            clicksCell.textContent = data.clicks;
            row.appendChild(clicksCell);

            const weightCell = document.createElement('td');
            weightCell.textContent = calculateWeight(data.bombs, data.clicks).toFixed(2);
            row.appendChild(weightCell);

            table.appendChild(row);
        });
    }

    // Calculate weight for each tile based on bombs and clicks
    function calculateWeight(bombs, clicks) {
        if (clicks === 0) return 1; // Prevent divide-by-zero errors
        return 1 / (1 + bombs + clicks);
    }

    // Initialize tile history (track bombs and clicks for each tile)
    function initializeTileHistory(tiles) {
        tiles.forEach((tile, index) => {
            if (!tileHistory.has(index)) {
                tileHistory.set(index, { bombs: 0, clicks: 0 });
            }
        });
    }

    // Log messages to the console
    function log(message, type = 'info') {
        switch (type) {
            case 'error':
                console.error(`[Mines Game] ${message}`);
                break;
            case 'success':
                console.log(`%c[Mines Game] ${message}`, 'color: green');
                break;
            default:
                console.log(`[Mines Game] ${message}`);
        }
    }

    // Cashout if the game ends or after max clicks
    function clickCashoutButton() {
        const cashoutButton = document.querySelector(cashoutButtonSelector);
        if (cashoutButton) {
            log('Cashout initiated...', 'success');
            cashoutButton.click();
        } else {
            log('Cashout button not found. Retrying...', 'error');
            setTimeout(clickCashoutButton, retryDelay);
        }
    }

    // Initialize everything
    window.addEventListener('load', () => {
        createForm();
        createTable();
    });

})();

