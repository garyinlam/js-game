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

const grids = document.getElementsByClassName("grid");
const startButton = document.getElementById("start");
const placeButton = document.getElementById("place-ship");
const instructions = document.querySelector(".instructions");
const rotateButton = document.getElementById("rotate");



const letters = [' ','A','B','C','D','E','F','G','H','I','J'];
for (const item of grids) {
  for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 11; j++) {
      item.innerHTML += `<div class="grid__box">${letters[j]}${i > 0 ? i : " "}</div>`
    }
  }
}

let lastClicked = [0,0];

const startGame = () => {
  //start game
  instructions.innerHTML = "Place Aircraft Carrier (5)"
  setupGame()
}

let counter = 0;
  
const setupGame = () => {
  //game setup
  player.ships.forEach((ship) => {
    grids[0].innerHTML += `<div class="ship ship__${ship.name}"></div>`;
  });

  setupBoxes();


  
}

const setupBoxes = () => {
  const boxes = document.getElementsByClassName("grid__box");
  for (const box of boxes) {
    box.coord = [letters.indexOf(box.innerHTML.slice(0,1)),Number(box.innerHTML.slice(1))];
    const styleText = `
    grid-row: ${box.coord[1]+1} ;
    grid-column: ${box.coord[0]+1};
    `;
    box.style.cssText += styleText;
    box.addEventListener("click",() => {
      lastClicked = box.coord;
      instructions.innerHTML = `Last clicked: ${lastClicked}`
    });
  }
}

placeButton.addEventListener("click", () => {
  const x = lastClicked[1]-1;
  const y = lastClicked[0]-1;
  if(counter < 5){
    const placed = place(player.ships[counter],x,y,player.grid);
    if(placed) {
      counter++;
    } else {
      console.log("try again");
    }
    if (counter == 5) {
      placeButton.disabled = true;
    }
  } else {
    console.log("no more to place");
  }
});

rotateButton.addEventListener("click",() => player.ships[counter].orientation === "ns" ? player.ships[counter].orientation = "ew" : player.ships[counter].orientation = "ns");

startButton.addEventListener("click", startGame);
/*




const isGameStarted = false;



const resetGame = () => {
  //resets game
}

*/