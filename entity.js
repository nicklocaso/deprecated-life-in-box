"use strict";

class Entity {
  constructor({ x, y, genoma }) {
    this.x = x;
    this.y = y;
    this.xx = 0;
    this.yy = 0;
    this.genoma = genoma || new Genoma();
    this.sex = this.genoma.getSex();
    // console.log(this.genoma.getLife());
    this.end = Date.now() + this.genoma.getLife() * 1000;
    this.size = 25;
    this.colors = this.genoma.getColors();
    this.energy = 100;
    this.eggs = this.genoma.getEggs();
    this.lastEgg = Date.now(); // + 10000;
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

  update(memory, index) {
    let xDirection = 0;
    let yDirection = 0;

    if (Date.now() > this.end) {
      this.energy = 0;
    }
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
            // this.size++;
          }
        } else {
          // Go Away
          if (this.x < other.x && xDirection > 0) xDirection *= -1;
          if (this.x > other.x && xDirection < 0) xDirection *= -1;
          if (this.y < other.y && yDirection > 0) yDirection *= -1;
          if (this.y > other.y && yDirection < 0) yDirection *= -1;

          if (distance < other.size / 2) {
            // this.size--;
          }
        }

        // Mate
        if (Date.now() - this.lastEgg > 10000) {
          // console.log("this", this.genoma._value[0].join());
          // console.log("this", this.genoma._value[1].join());
          // console.log("other", other.genoma._value[0].join());
          // console.log("other", other.genoma._value[1].join());
          if (this.sex != other.sex) {
            // if (this.sex != other.sex) {
            for (let j = 0; j < this.eggs; j++) {
              memory.toAdd = [
                ...memory.toAdd,
                new Entity({
                  x: this.x,
                  y: this.y,
                  genoma: Genoma.mate(this.genoma, other.genoma)
                })
              ];
            }
            this.lastEgg = Date.now();
          }
        }
      }
    }

    // With World Walls
    if (this.x < 0) {
      this.x = 0;
      xDirection = Math.abs(xDirection);
      this.xx = Math.abs(this.xx);
    }
    if (this.x > memory.options.width) {
      this.x = memory.options.width;
      xDirection = Math.abs(xDirection) * -1;
      this.xx = Math.abs(this.xx) * -1;
    }
    if (this.y < 0) {
      this.y = 0;
      yDirection = Math.abs(yDirection);
      this.yy = Math.abs(this.yy);
    }
    if (this.y > memory.options.height) {
      this.y = memory.options.height;
      yDirection = Math.abs(yDirection) * -1;
      this.yy = Math.abs(this.yy) * -1;
    }

    this.xx = this.xx / 1.02;
    this.yy = this.yy / 1.02;

    this.xx += xDirection;
    this.yy += yDirection;
    this.x += this.xx;
    this.y += this.yy;
  }

  draw() {
    // fill(this.energy > 255 ? 255 : this.energy, 255);
    fill(color(this.colors.rr, this.colors.gg, this.colors.bb, 50));
    circle(this.x, this.y, this.size / 3);
    circle(this.x, this.y, this.size);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso
}
