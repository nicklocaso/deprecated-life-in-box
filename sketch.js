"use strict";

let width = 900;
let height = 700;
let entities = [];

function setup() {
  createCanvas(width, height);
  frameRate(20);

  for (let i = 0; i < 150; i++) {
    entities = [
      ...entities,
      new Entity({
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        size: Math.floor(Math.random() * (70 - 5 + 1)) + 5
      })
    ];
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
