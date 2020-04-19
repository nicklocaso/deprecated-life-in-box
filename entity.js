"use strict";

let genomaLen = 16;

function getSize(genoma) {}

class Entity {
  constructor({ x, y, size, energy, view, genoma }) {
    this.x = x;
    this.y = y;
    this.size = size || 10;

    this.energy = energy || 255;
    this.view = view || this.size * 1.5;
    this.eggs = 10;
    this.step = 10;
    this.oldXDirection = 0;
    this.oldYDirection = 0;

    this.genoma = genoma || Entity.generateGenoma();
  }

  static distance(a, b) {
    return dist(a.x, a.y, b.x, b.y);
  }

  static collide(a, b) {
    return Entity.distance(a, b) < a.size / 2 + b.size / 2;
  }

  static generateGenoma() {
    let result = [];
    while (result.length < 16) {
      result = [...result, getRandomInt(0, 1)];
    }
    return result;
  }

  see(other) {
    return Entity.distance(this, other) < this.view / 2 + other.view / 2;
  }

  static mate(a, b) {}

  update(others) {
    if (this.energy <= 0) return;

    // Mov
    let xDirection = 0;
    let yDirection = 0;
    for (let other of others) {
      if (other.energy <= 0) continue;
      if (Entity.collide(this, other)) {
        this.energy += this.size - other.size;

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
      } else if (this.see(other)) {
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
  }

  draw() {
    fill(this.energy);
    circle(this.x, this.y, this.size);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso
}

console.log(Entity.generateGenoma());
