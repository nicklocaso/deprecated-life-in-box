"use strict";

const WIDTH = 900;
const HEIGHT = 700;

let entities = [];

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(25);

  // Initialization

  let genoma = new Genoma();
  for (let i = 0; i < 150; i++) {
    genoma.mutate(5);
    entities = [
      ...entities,
      new Entity({
        x: getRandomInt(0, WIDTH),
        y: getRandomInt(0, HEIGHT),
        genoma
      })
    ];
  }
}

function draw() {
  // Draw background
  background(150);
  // Draw entities
  for (let e of entities) {
    e.draw();
  }
  // Update entities
  update();
}

function update() {
  let toAdd = [];
  for (let i = 0; i < entities.length; i++) {
    if (entities.toRemove) {
      entities.splice(i, 1);
      continue;
    }
    toAdd = [...toAdd, ...(entities[i].update(entities, WIDTH, HEIGHT) || [])];
  }
  // Add New Ones
  entities = [...entities, ...toAdd];
}
