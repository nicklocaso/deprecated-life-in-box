"use strict";

class Entity {
  constructor({ x, y, genoma }) {
    this.x = x;
    this.y = y;
    this.xx = 0;
    this.yy = 0;
    this.genoma = genoma || new Genoma();
    this.size = 10 * this.genoma.getSize();
    this.colors = this.genoma.getColors();

    this.energy = 100;
    // this.eggs = 10;
    // this.step = 10;
    // this.oldXDirection = 0;
    // this.oldYDirection = 0;

    this.lastEgg = Date.now() + 50000;
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

  // update(others) {
  //   let sons = [];
  //   if (this.energy <= 0) return [];

  //   let xDirection = 0;
  //   let yDirection = 0;
  //   for (let other of others) {
  //     if (other.energy <= 0) continue;

  //     if (Entity.collide(this, other)) {
  //       if (this.genoma.getSex() === other.genoma.getSex()) {
  //         let den = this.x - other.x;
  //         if (den != 0) {
  //           let m = (this.y - other.y) / den;
  //           xDirection = (Math.cos(m) * this.step) / this.size;
  //           yDirection = (Math.sin(m) * this.step) / this.size;
  //         } else {
  //           xDirection = this.oldXDirection;
  //           yDirection = this.oldYDirection;
  //         }
  //         if (this.x < other.x) xDirection *= -1;
  //         if (this.y < other.y) yDirection *= -1;
  //       } else {
  //         sons = [
  //           new Entity({
  //             x: this.x + 30,
  //             y: this.y + 30,
  //             genoma: Genoma.mate(this.genoma, other.genoma)
  //           })
  //         ];
  //       }
  //     }
  //   }
  //   this.oldXDirection = xDirection;
  //   this.oldYDirection = yDirection;
  //   this.x += xDirection;
  //   this.y += yDirection;

  //   // Stats
  //   this.energy -= Math.abs(xDirection);
  //   this.energy -= Math.abs(yDirection);

  //   if (this.energy > 255) this.energy = 255;

  //   return sons;
  // }

  update(memory, index) {
    let xDirection = 0;
    let yDirection = 0;

    if (this.energy <= 0) return;

    for (let i = 0; i < memory.entities.length; i++) {
      if (i === index) continue;
      // Iteration with the other
      let other = memory.entities[i];
      if (other.energy <= 0) continue;
      if (Entity.collide(this, other)) {
        let den = this.x - other.x;
        if (den != 0) {
          let m = (this.y - other.y) / den;
          xDirection = Math.cos(m) * (other.size / 1000);
          yDirection = Math.sin(m) * (other.size / 1000);
        }

        let distance = Entity.distance(this, other);
        if (this.size / 2 > other.size) {
          // Try to kill
          if (this.x < other.x && xDirection < 0) xDirection *= -1;
          if (this.x > other.x && xDirection > 0) xDirection *= -1;
          if (this.y < other.y && yDirection < 0) yDirection *= -1;
          if (this.y > other.y && yDirection > 0) yDirection *= -1;

          if (distance < this.size / 2) {
            this.energy++;
          }
        } else {
          // Go Away
          if (this.x < other.x && xDirection > 0) xDirection *= -1;
          if (this.x > other.x && xDirection < 0) xDirection *= -1;
          if (this.y < other.y && yDirection > 0) yDirection *= -1;
          if (this.y > other.y && yDirection < 0) yDirection *= -1;

          if (distance < other.size / 2) {
            this.energy--;
          }
        }

        // Mate
        if (Date.now() - this.lastEgg > 10000) {
          if (this.genoma.getSex() !== other.genoma.getSex()) {
            memory.toAdd = [
              ...memory.toAdd,
              new Entity({
                x: this.x,
                y: this.y,
                genoma: Genoma.mate(this.genoma, other.genoma)
              })
            ];
            this.lastEgg = Date.now();
          }
        }
      }
    }

    // With World Walls
    if (this.x < 0) {
      this.x = 0;
      xDirection *= -1;
    }
    if (this.x > memory.options.width) {
      this.x = memory.options.width;
      xDirection *= -1;
    }
    if (this.y < 0) {
      this.y = 0;
      yDirection *= -1;
    }
    if (this.y > memory.options.height) {
      this.y = memory.options.height;
      yDirection *= -1;
    }

    this.xx = this.xx / 1.05;
    this.yy = this.yy / 1.05;

    this.xx += xDirection;
    this.yy += yDirection;
    this.x += this.xx;
    this.y += this.yy;
  }

  draw() {
    fill(this.energy > 255 ? 255 : this.energy, 255);
    circle(this.x, this.y, this.size / 3);
    fill(color(this.colors.rr, this.colors.gg, this.colors.bb, 50));
    circle(this.x, this.y, this.size);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso
}
