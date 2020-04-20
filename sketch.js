"use strict";

let width = 400; //900;
let height = 200; // 700;
let entities = [];

function setup() {
  createCanvas(width, height);
  frameRate(20);

  let g = new Genoma();

  for (let i = 0; i < 150; i++) {
    let genoma = g;
    if (getRandomInt(0, 1)) genoma.changeSex();

    let e = new Entity({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      genoma
    });
    e.size = 25;
    entities = [...entities, e];
  }
}
function draw() {
  background(150);

  // for (let e of entities) e.draw();

  for (let i = 0; i < entities.length; i++) {
    if (entities[i].energy <= 0) {
      entities.splice(i, 1);
      continue;
    }
    entities[i].draw();
  }

  let gameMemory = {
    options: { width, height },
    entities: entities.map(x => x),
    toRemove: [],
    toAdd: []
  };
  for (let i = 0; i < entities.length; i++) {
    entities[i].update(gameMemory, i);
  }

  if (gameMemory.toAdd && Array.isArray(gameMemory.toAdd))
    entities = [...entities, ...gameMemory.toAdd];
}
