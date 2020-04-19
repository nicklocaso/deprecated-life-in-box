"use strict";

let width = 900;
let height = 700;
let entities = [];

function setup() {
  createCanvas(width, height);
  frameRate(20);

  for (let i = 0; i < 100; i++) {
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

  let toAdd = [];
  for (let i = 0; i < entities.length; i++) {
    let actual = entities.splice(i, 1)[0];
    toAdd = actual.update(entities);
    entities.splice(i, 0, actual);
  }
  if (toAdd && Array.isArray(toAdd)) entities = [...entities, ...toAdd];
  for (let e of entities) e.draw();
}
