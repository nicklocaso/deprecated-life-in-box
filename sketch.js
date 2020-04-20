"use strict";

let width = 900;
let height = 700;
let entities = [];

function setup() {
  createCanvas(width, height);
  frameRate(25);

  for (let y = 0; y < 1; y++) {
    let _genoma = new Genoma();
    for (let i = 0; i < 10; i++) {
      let e = new Entity({
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        genoma: _genoma
      });
      e.mutate();
      entities = [...entities, e];
    }
  }
}
function draw() {
  background(150);

  // for (let e of entities) e.draw();

  let species = {};
  let females = 0;
  let males = 0;

  for (let i = 0; i < entities.length; i++) {
    if (entities[i].alive <= 0) {
      entities.splice(i, 1);
      continue;
    }
    entities[i].draw();
    if (entities[i].genoma.getSex()) males++;
    else females++;

    species[entities[i].genoma.getKey()] =
      (species[entities[i].genoma.getKey()] || 0) + 1;
  }

  textSize(20);
  fill(20);
  text(`Females: ${females}`, 10, 20);
  text(`Males: ${males}`, 10, 40);
  let k = 40;
  for (let s of Object.keys(species)) {
    k += 20;
    text(`${s}: ${species[s]}`, 10, k);
  }
  // text(`Species: ${Object.keys(species).length}`, 10, 60);

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
