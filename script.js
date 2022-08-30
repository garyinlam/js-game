const grids = document.getElementsByClassName("grid");
const startButton = document.getElementById("start");
const placeButton = document.getElementById("place-ship");
const instructions = document.querySelector(".instructions");
const rotateButton = document.getElementById("rotate");
const ships = document.querySelector(".ships");
const fireButton = document.getElementById("fire");
let boxes;

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

let player = new Player();
let ai = new Player();


const printGrid = (grid) => {
  grid.forEach((i) => {
    console.log(i.toString());
  });
}

const coordToNumber = (coord) => {
  return coord[1]+12+(coord[0]*11);
}


const place = (ship,x,y,board) => {
  let placed = false
  let clear = true;
  if (ship.orientation === "ns") {
    if (x+ship.size > 10) {
      clear = false;
    } else {
      for (let i = 0; i < ship.size; i++) {
        if(board[x+i][y] != 'w') {
          clear = false;
        }
      }
    }
    if (clear) {
      for (let i = 0; i < ship.size; i++) {
        board[x+i][y] = ship.name[0];
      }
      ship.coordinates = [x,y];
      placed = true;
    }
  } else {
    if (y+ship.size > 10) {
      clear = false;
    } else {
      for (let i = 0; i < ship.size; i++) {
        if(board[x][y+i] != 'w') {
          clear = false;
        }
      }
    }
    if (clear) {
      for (let i = 0; i < ship.size; i++) {
        board[x][y+i] = ship.name[0];
      }
      ship.coordinates = [x,y];
      placed = true;
    }
  }
  return placed;
}

const shoot = (xc,yc,board,ships) => {
  let hit = false;
  const square = board[xc][yc];
  if (square === 'w') {
    board[xc][yc] += 'h';
    console.log("miss");
  } else {
    if (square.length === 2) {
      console.log("already shot");
    } else {
      ships.forEach((ship) => {
        if (ship.name[0] == square) {
          ship.size--;
          if (ship.size == 0) {
            ship.isDestroyed = true;
            console.log(`${ship.name} destroyed`);
          }
        }
      })
      board[xc][yc] += 'h';
      console.log("hit"); 
    }
    hit = true;
  }
  return hit;
}



const letters = [' ','A','B','C','D','E','F','G','H','I','J'];
for (const item of grids) {
  for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 11; j++) {
      item.innerHTML += `<div class="grid__box">${letters[j]}${i > 0 ? i : " "}</div>`
    }
  }
}

let lastClicked = 0;

const startGame = () => {
  //start game
  instructions.innerHTML = "Place carrier (5)"
  startButton.disabled = true;
  setupGame()
}

let counter = 0;
  
const setupGame = () => {
  //game setup
  player.ships.forEach((ship) => {
    ships.innerHTML += `<div class="ship ship__${ship.name}"></div>`;
  });

  placeButton.disabled = false;

  setupBoxes();

  ai.ships.forEach((ship) => {
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

const setupBoxes = () => {
  let counter = 0;
  boxes = document.getElementsByClassName("grid__box");
  for (const box of boxes) {
    box.coord = [letters.indexOf(box.innerHTML.slice(0,1)),Number(box.innerHTML.slice(1))];
    const styleText = `
    grid-row: ${box.coord[1]+1} ;
    grid-column: ${box.coord[0]+1};
    `;
    box.style.cssText += styleText;
    box.counter = counter++;
    box.addEventListener("click",() => {
      boxes[lastClicked].classList.remove("last");
      lastClicked = box.counter;
      boxes[lastClicked].classList.add("last");
    });
  }
}

placeButton.addEventListener("click", () => {
  const x = boxes[lastClicked].coord[1]-1;
  const y = boxes[lastClicked].coord[0]-1;
  if(counter < 5){
    const placed = place(player.ships[counter],x,y,player.grid);
    if(placed) {
      const start = coordToNumber(player.ships[counter].coordinates);
      let end = 0;
      let width = 100;
      let height = 100;
      if(player.ships[counter].orientation === "ns") {
        end = coordToNumber([player.ships[counter].coordinates[0]+player.ships[counter].size-1,player.ships[counter].coordinates[1]]);
        width = boxes[start].getBoundingClientRect().width;
        height = boxes[end].getBoundingClientRect().top - boxes[start].getBoundingClientRect().top + boxes[start].getBoundingClientRect().height;
      } else {
        end = coordToNumber([player.ships[counter].coordinates[0],player.ships[counter].coordinates[1]+player.ships[counter].size-1]);
        height = boxes[start].getBoundingClientRect().height;
        width = boxes[end].getBoundingClientRect().left - boxes[start].getBoundingClientRect().left + boxes[start].getBoundingClientRect().width;
      }

      const shipToDisp = document.querySelector(`.ship__${player.ships[counter].name}`);
      shipToDisp.style.cssText = `
      display: block;
      top: ${boxes[start].getBoundingClientRect().top};
      left: ${boxes[start].getBoundingClientRect().left};
      width: ${width};
      height: ${height};
      `;


      counter++;
      if (counter < 5) {
        instructions.innerHTML = `Place ${player.ships[counter].name} (${player.ships[counter].size})`;
      }
    } else {
      console.log("try again");
    }
    if (counter == 5) {
      placeButton.disabled = true;
      instructions.innerHTML = "Finished ship placement, choose enemy square to shoot"
      fireButton.disabled = false;
    }
  } else {
    console.log("no more to place");
  }
});

rotateButton.addEventListener("click",() => player.ships[counter].orientation === "ns" ? player.ships[counter].orientation = "ew" : player.ships[counter].orientation = "ns");

startButton.addEventListener("click", startGame);

fireButton.addEventListener("click", () => {
  const x = boxes[lastClicked].coord[1]-1;
  const y = boxes[lastClicked].coord[0]-1;
  const shot = shoot(x, y, ai.grid, ai.ships);
  if (shot) {
    let shipsDestroyed = 0;
    ai.ships.forEach((ship) => {
      if (ship.isDestroyed) {
        shipsDestroyed++;
      }
    });
    if (shipsDestroyed == ai.ships.length) {
      alert("you win");
      instructions.innerHTML = "You win!";
      fire.disabled = true;
    } else {
      boxes[lastClicked].classList.add("hit")
      instructions.innerHTML = "Hit! Shoot again";
    }
  } else {
    boxes[lastClicked].classList.add("miss");
    let aiHit = true;
    while (aiHit) {
      const xCoord = Math.floor(Math.random() * 10);
      const yCoord = Math.floor(Math.random() * 10);
      console.log(`ai shot ${letters[yCoord+1]},${xCoord+1}`);
      const didHit = shoot(xCoord, yCoord, player.grid, player.ships);
      const boxPos = coordToNumber([xCoord,yCoord]);
      if (didHit) {
        boxes[boxPos].classList.add("hit");
        console.log("ai hit");
        let shipsDestroyed = 0;
        player.ships.forEach((ship) => {
          if (ship.isDestroyed) {
            shipsDestroyed++;
          }
        });
        if (shipsDestroyed == player.ships.length) {
          console.log("you lose");
          fire.disabled = true;
        }
      } else {
        boxes[boxPos].classList.add("miss");
        console.log("ai missed");
      }
      aiHit = didHit;
    }
  }
});

const resetGame = () => {
  player = new Player();
  ai = new Player();
  startButton.disabled = false;
  placeButton.disabled = true;
  fireButton.disabled = true;
}
/*




const isGameStarted = false;



const resetGame = () => {
  //resets game
}

*/