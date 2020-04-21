"use strict";

const WIDTH = 900;
const HEIGHT = 700;

let entities = [];

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(25);

  // Initialization

  let parentA;
  let parentB;

  parentA = new Entity();
  parentA.genoma.DNA[0] = 0;
  parentB = new Entity({ genoma: parentA.genoma });
  parentB.genoma.DNA[0] = 1;

  for (let i = 0; i < 150; i++) {
    entities = [
      ...entities,
      new Entity({
        x: getRandomInt(0, WIDTH),
        y: getRandomInt(0, HEIGHT),
        genoma: parentA.genoma.reproduce(parentB.genoma)
      })
    ];
  }
}

function draw() {
  // Draw background
  background(200);
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
    if (entities[i].toRemove) {
      entities.splice(i, 1);
      continue;
    }
    toAdd = [...toAdd, ...(entities[i].update(entities, WIDTH, HEIGHT) || [])];
  }
  // Add New Ones
  entities = [...entities, ...toAdd];
}
