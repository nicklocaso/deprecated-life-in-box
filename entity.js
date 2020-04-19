"use strict";

class Entity {
  constructor({ x, y, genoma }) {
    this.x = x;
    this.y = y;
    this.genoma = genoma || new Genoma();
    this.size = 10 * this.genoma.getSize();

    this.energy = 255;
    // this.eggs = 10;
    this.step = 10;
    this.oldXDirection = 0;
    this.oldYDirection = 0;

    this.genoma = genoma || new Genoma();
  }

  static distance(a, b) {
    return dist(a.x, a.y, b.x, b.y);
  }

  static collide(a, b) {
    return Entity.distance(a, b) < a.size / 2 + b.size / 2;
  }

  inMyActionArea(other) {
    return Entity.distance(this, other) < this.actionArea + other.size;
  }

  update(others) {
    let sons = [];
    if (this.energy <= 0) return [];

    let xDirection = 0;
    let yDirection = 0;
    for (let other of others) {
      if (other.energy <= 0) continue;

      if (Entity.collide(this, other)) {
        if (this.genoma.getSex() === other.genoma.getSex()) {
          let den = this.x - other.x;
          if (den != 0) {
            let m = (this.y - other.y) / den;
            xDirection = (Math.cos(m) * this.step) / this.size;
            yDirection = (Math.sin(m) * this.step) / this.size;
          } else {
            xDirection = this.oldXDirection;
            yDirection = this.oldYDirection;
          }
          if (this.x < other.x) xDirection *= -1;
          if (this.y < other.y) yDirection *= -1;
        } else {
          sons = [
            new Entity({
              x: this.x + 30,
              y: this.y + 30,
              genoma: Genoma.mate(this.genoma, other.genoma)
            })
          ];
        }
      }
    }
    this.oldXDirection = xDirection;
    this.oldYDirection = yDirection;
    this.x += xDirection;
    this.y += yDirection;

    // Stats
    this.energy -= Math.abs(xDirection);
    this.energy -= Math.abs(yDirection);

    if (this.energy > 255) this.energy = 255;

    return sons;
  }

  draw() {
    noFill();
    //fill(this.energy);
    circle(this.x, this.y, this.size);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso
}
