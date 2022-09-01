// DOM elements
const grids = document.getElementsByClassName("grid");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const placeButton = document.getElementById("place-ship");
const instructions = document.querySelector(".container__instructions");
const rotateButton = document.getElementById("rotate");
const ships = document.querySelectorAll(".ships");
const fireButton = document.getElementById("fire");
const history = document.getElementById("history");

let boxes;

// Player class
class Player {
  constructor() {
    this.grid = new Array(10);
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = new Array(10).fill("w");
    }
    this.ships = [{
      name: "carrier",
      size: 5,
      coordinates: [0,0],
      orientation: "ns",
      isDestroyed: false
    },{
      name: "battleship",
      size: 4,
      coordinates: [0,0],
      orientation: "ns",
      isDestroyed: false
    },{
      name: "destroyer",
      size: 3,
      coordinates: [0,0],
      orientation: "ns",
      isDestroyed: false
    },{
      name: "submarine",
      size: 3,
      coordinates: [0,0],
      orientation: "ns",
      isDestroyed: false
    },{
      name: "patrol",
      size: 2,
      coordinates: [0,0],
      orientation: "ns",
      isDestroyed: false
    }];
  }
}

// Both players
let player = new Player();
let ai = new Player();

// Print grid function used for debugging
const printGrid = (grid) => {
  grid.forEach((i) => {
    console.log(i.toString());
  });
}

// Change a coordinate pair to match the corresponding number position in the boxes array
const coordToNumber = (coord) => {
  return coord[1]+12+(coord[0]*11);
}

// Place a ship on the board
const place = (ship,x,y,board) => {
  let placed = false
  let clear = true;
  // Check orientation
  if (ship.orientation === "ns") {
    // Check if ship surpasses boundaries
    if (x+ship.size > 10) {
      clear = false;
    } else {
      // Check if ship overlaps with other ships
      for (let i = 0; i < ship.size; i++) {
        if(board[x+i][y] != 'w') {
          clear = false;
        }
      }
    }
    // Ship is able to be placed without issue
    if (clear) {
      for (let i = 0; i < ship.size; i++) {
        board[x+i][y] = ship.name[0];
      }
      ship.coordinates = [x,y];
      placed = true;
    }

  // Ship orientation = 'ew'
  } else {
    // Check if ship surpasses boundaries
    if (y+ship.size > 10) {
      clear = false;
    } else {
      // Check if ship overlaps with other ships
      for (let i = 0; i < ship.size; i++) {
        if(board[x][y+i] != 'w') {
          clear = false;
        }
      }
    }
    // Ship is able to be placed without issue
    if (clear) {
      for (let i = 0; i < ship.size; i++) {
        board[x][y+i] = ship.name[0];
      }
      ship.coordinates = [x,y];
      placed = true;
    }
  }
  // Return if the ship was successfully placed or not
  return placed;
}

// Shoot at a square
const shoot = (xc,yc,board,ships) => {
  let hit = false;
  const square = board[xc][yc];
  // Shot misses
  if (square === 'w') {
    board[xc][yc] += 'h';
  // Shot hits or has already been shot
  } else {
    // Shot hits ship
    if (square.length === 1) {
      // Loop through ships and check which ship was hit
      ships.forEach((ship) => {
        if (ship.name[0] == square) {
          // Reduce size to simulate remaining life
          ship.size--;
          // Ship has been destroyed
          if (ship.size == 0) {
            ship.isDestroyed = true;
            history.innerHTML += `<p>${ship.name.toUpperCase()} destroyed</p>`;
          }
        }
      })
      // Mark square as shot
      board[xc][yc] += 'h';
    }
    // Return true to show a ship was hit or already shot at - can shoot again
    hit = true;
  }
  return hit;
}


// Create both grids using JS
const letters = [' ','A','B','C','D','E','F','G','H','I','J'];
for (const item of grids) {
  for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 11; j++) {
      item.innerHTML += `<div class="grid__box">${letters[j]}${i > 0 ? i : " "}</div>`
    }
  }
}

let lastClicked = 0;

// Start game function, called when "Start Game" button is pressed
const startGame = () => {
  instructions.innerHTML = "Place carrier (5)"
  startButton.disabled = true;
  setupGame()
}

let counter = 0;
  
// Set up game
const setupGame = () => {
  // Place player ships in document - currently hidden
  player.ships.forEach((ship) => {
    ships[0].innerHTML += `<div class="ship ship--${ship.name}">${ship.name.toUpperCase()}</div>`;
  });

  // Activate buttons
  placeButton.disabled = false;
  rotateButton.disabled = false;

  // Setup boxes in grid and add event listeners
  setupBoxes();

  // place AI ships
  ai.ships.forEach((ship) => {
    ships[1].innerHTML += `<p class="${ship.name}">${ship.name.toUpperCase()}</p>`;
    let placed = false;
    while(!placed) {
      const xCoord = Math.floor(Math.random() * (11-ship.size));
      const yCoord = Math.floor(Math.random() * (11-ship.size));
      ship.coordinates = [yCoord,xCoord];
      const direction = Math.floor(Math.random() * 2);
      direction == 1 ? ship.orientation = "ns" : ship.orientation = "ew"
      placed = place(ship,xCoord,yCoord,ai.grid);
    }
  });
}

// Setup boxes for use
const setupBoxes = () => {
  let counter = 0;
  // Store boxes as HTMLCollection
  boxes = document.getElementsByClassName("grid__box");
  for (const box of boxes) {
    // Set box coordinate
    box.coord = [letters.indexOf(box.innerHTML.slice(0,1)),Number(box.innerHTML.slice(1))];
    // Set box grid and row
    const styleText = `
    grid-row: ${box.coord[1]+1} ;
    grid-column: ${box.coord[0]+1};
    `;
    box.style.cssText += styleText;
    // Set box counter - equivalent to position in HTMLCollection
    box.counter = counter++;
    // Event listener to show and store last selected box
    box.addEventListener("click",() => {
      boxes[lastClicked].classList.remove("last");
      lastClicked = box.counter;
      boxes[lastClicked].classList.add("last");
    });
  }
}

// Reset game
const resetGame = () => {
  // New player obects
  player = new Player();
  ai = new Player();
  // Activate and deactivate buttons
  startButton.disabled = false;
  placeButton.disabled = true;
  fireButton.disabled = true;
  rotateButton.disabled = true;
  // Clear previous game instructions and history
  history.innerHTML = "";
  instructions.innerHTML = "Press start";
  ships[1].innerHTML = "<h2>Opponent ships:</h2>"
  // Hide ships
  const shipsToHide = document.getElementsByClassName("ship");
  for (const ship of shipsToHide) {
    ship.style.cssText = "";
  }
  counter = 0;
  // Clear hits and misses
  for (const box of boxes) {
    box.classList.remove("miss");
    box.classList.remove("hit");
  }
}


placeButton.addEventListener("click", () => {
  // Error checking - invalid placements
  if(lastClicked > 120){
    alert("Cannot place ship on enemy grid");
    return;
  }
  if(lastClicked % 11 === 0 || lastClicked < 12){
    alert("Cannot place ship outside grid");
    return;
  }
  const x = boxes[lastClicked].coord[1]-1;
  const y = boxes[lastClicked].coord[0]-1;
  if(counter < 5){
    // Try to place ship
    const placed = place(player.ships[counter],x,y,player.grid);
    // Successful placement
    if(placed) {
      // Show ship
      const start = coordToNumber(player.ships[counter].coordinates);
      let end = 0;
      let width = 100;
      let height = 100;
      const shipToDisp = document.querySelector(`.ship--${player.ships[counter].name}`);
      shipToDisp.style.cssText = "";
      // Orientation dependent - calculate position and size
      if(player.ships[counter].orientation === "ns") {
        end = coordToNumber([player.ships[counter].coordinates[0]+player.ships[counter].size-1,player.ships[counter].coordinates[1]]);
        width = boxes[start].getBoundingClientRect().width;
        height = boxes[end].getBoundingClientRect().top - boxes[start].getBoundingClientRect().top + boxes[start].getBoundingClientRect().height;
        shipToDisp.style.cssText = "writing-mode: vertical-rl;"
      } else {
        end = coordToNumber([player.ships[counter].coordinates[0],player.ships[counter].coordinates[1]+player.ships[counter].size-1]);
        height = boxes[start].getBoundingClientRect().height;
        width = boxes[end].getBoundingClientRect().left - boxes[start].getBoundingClientRect().left + boxes[start].getBoundingClientRect().width;
      }

      shipToDisp.style.cssText += `
      display: block;
      top: ${boxes[start].getBoundingClientRect().top};
      left: ${boxes[start].getBoundingClientRect().left};
      width: ${width};
      height: ${height};
      `;

      rotateButton.innerText = rotateButton.innerText.slice(0,-1) + "↕"
      counter++;
      // Tell player to place next ship
      if (counter < 5) {
        instructions.innerHTML = `Place ${player.ships[counter].name} (${player.ships[counter].size})`;
      }
    } else {
      alert(`Failed to place try again in a different position`);
    }
    // Finished placement - tell player and disable buttons
    if (counter == 5) {
      placeButton.disabled = true;
      instructions.innerHTML = "Finished placement, shoot enemy square"
      fireButton.disabled = false;
      history.innerHTML = "<p>Game Start</p><p>---------------Your Turn---------------</p>"
      rotateButton.disabled = true;
    }
  }
});

rotateButton.addEventListener("click",() => {
  // Rotate ship placement and show ship direction
  if(player.ships[counter].orientation === "ns"){
    player.ships[counter].orientation = "ew"
    rotateButton.innerText = rotateButton.innerText.slice(0,-1) + "↔"
  } else {
    player.ships[counter].orientation = "ns"
    rotateButton.innerText = rotateButton.innerText.slice(0,-1) + "↕"
  }
});

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

// Fire button - does game logic
fireButton.addEventListener("click", () => {
  // Error checking - can't shoot own grid or outside grid
  if(lastClicked < 121){
    alert("Cannot shoot your own grid");
    return;
  }
  if(lastClicked % 11 === 0 || lastClicked < 132){
    alert("Cannot shoot outside grid");
    return;
  }
  // Try to shoot
  const x = boxes[lastClicked].coord[1]-1;
  const y = boxes[lastClicked].coord[0]-1;
  const shot = shoot(x, y, ai.grid, ai.ships);
  history.innerHTML += `<p>You shot ${letters[y+1]}${x+1}</p>`;
  // Hit registered
  if (shot) {
    // Check if game over
    let shipsDestroyed = 0;
    boxes[lastClicked].classList.add("hit");
    // Check if a ship was destroyed
    ai.ships.forEach((ship) => {
      if (ship.isDestroyed) {
        // Track ship destroyed and update ship tracking
        shipsDestroyed++;
        document.querySelector(`.${ship.name}`).classList.add("destroyed");
      }
    });

    // Game over - win
    if (shipsDestroyed == ai.ships.length) {
      alert("you win");
      instructions.innerHTML = "You win!";
      history.innerHTML += "<p>You win!</p>"
      fire.disabled = true;
    } else {
      // Not game over, shoot again
      instructions.innerHTML = "Shoot again";
      history.innerHTML += "<p>and hit</p>"
    }

  // Miss shot
  } else {
    boxes[lastClicked].classList.add("miss");
    history.innerHTML += "<p>and missed</p>";

    // Do AI turn
    history.innerHTML += `<p>---------------AI turn---------------</p>`;
    let aiHit = true;
    while (aiHit) {
      // AI shoots randomly
      const xCoord = Math.floor(Math.random() * 10);
      const yCoord = Math.floor(Math.random() * 10);
      history.innerHTML += `<p>AI shot ${letters[yCoord+1]}${xCoord+1}</p>`;
      const didHit = shoot(xCoord, yCoord, player.grid, player.ships);
      const boxPos = coordToNumber([xCoord,yCoord]);
      if (didHit) {
        // If hit shoot again
        boxes[boxPos].classList.add("hit");
        history.innerHTML += `<p>and hit</p>`;

        // Check game over
        let shipsDestroyed = 0;
        player.ships.forEach((ship) => {
          if (ship.isDestroyed) {
            shipsDestroyed++;
          }
        });

        // Game over - lose
        if (shipsDestroyed == player.ships.length) {
          alert("You lose!");
          instructions.innerHTML = "You lose!";
          history.innerHTML += "<p>You lose!</p>"
          fire.disabled = true;
          aiHit = false;
          break;
        }
        
      // AI miss
      } else {
        boxes[boxPos].classList.add("miss");
        history.innerHTML += `<p>and missed</p><p>---------------Your Turn---------------</p>`;
      }
      aiHit = didHit;
    }
  }
});

