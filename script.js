const player = {
  grid: Array(10).fill(Array(10).fill(false)),
  ships: [{
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
  }]
};

const grids = document.getElementsByClassName("grid");

const letters = [' ','A','B','C','D','E','F','G','H','I','J'];
for (const item of grids) {
  for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 11; j++) {
      item.innerHTML += `<div class="grid__box">${letters[j]}${i > 0 ? i : " "}</div>`
    }
  }
}

const boxes = document.getElementsByClassName("grid__box");
for (const box of boxes) {
  box.coord = [letters.indexOf(box.innerHTML.slice(0,1)),Number(box.innerHTML.slice(1))];
  box.addEventListener("click",() => console.log(box.coord));
}

