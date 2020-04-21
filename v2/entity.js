"use strict";

class Entity {
  constructor({ x, y, xx, yy, genoma }) {
    // Position
    this.x = x || 0;
    this.y = y || 0;
    // Dynamics
    this.xx = xx || 0;
    this.yy = yy || 0;
    // Genoma
    this.genoma = new Genoma(genoma);

    this.lastsex = Date.now();
  }

  static distance(a, b) {
    return dist(a.x, a.y, b.x, b.y);
  }

  static collide(a, b) {
    return Entity.distance(a, b) < a.size / 2 + b.size / 2;
  }

  get size() {
    return this.genoma.getSIZE();
  }

  update(eList, width, height) {
    let toReturn = [];

    let xDirection = 0;
    let yDirection = 0;

    for (let other of eList) {
      if (other === this) continue;

      if (Entity.collide(this, other)) {
        // Go Away
        let den = this.x - other.x;
        if (den != 0) {
          let m = (this.y - other.y) / den;
          xDirection = Math.cos(m) * (other.size / 1000);
          yDirection = Math.sin(m) * (other.size / 1000);
        }
        if (this.x < other.x && xDirection > 0) xDirection *= -1;
        if (this.x > other.x && xDirection < 0) xDirection *= -1;
        if (this.y < other.y && yDirection > 0) yDirection *= -1;
        if (this.y > other.y && yDirection < 0) yDirection *= -1;

        // Mate
        if (Date.now() - this.lastsex > 10000) {
          let son = this.genoma.reproduce(other.genoma);
          if (son instanceof Genoma) {
            console.log("Figlio!");
            toReturn = [
              ...toReturn,
              new Entity({
                x: this.x,
                y: this.y,
                genoma: son
              })
            ];
            this.lastsex = Date.now();
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
    if (this.x > width) {
      this.x = width;
      xDirection = Math.abs(xDirection) * -1;
      this.xx = Math.abs(this.xx) * -1;
    }
    if (this.y < 0) {
      this.y = 0;
      yDirection = Math.abs(yDirection);
      this.yy = Math.abs(this.yy);
    }
    if (this.y > height) {
      this.y = height;
      yDirection = Math.abs(yDirection) * -1;
      this.yy = Math.abs(this.yy) * -1;
    }

    // Mooves
    if (Math.abs(this.xx) < 0.1 && Math.abs(this.yy) < 0.1) {
      this.xx = getRandomInt(0, 15);
      if (getRandomInt(0, 1)) this.xx *= -1;
      this.yy = getRandomInt(0, 15);
      if (getRandomInt(0, 1)) this.yy *= -1;
    }

    this.xx += xDirection;
    this.yy += yDirection;

    this.xx = this.xx / 1.02;
    this.yy = this.yy / 1.02;

    this.x += this.xx;
    this.y += this.yy;
  }

  draw() {
    fill(
      color(
        this.genoma.getRED(),
        this.genoma.getGREEN(),
        this.genoma.getBLUE(),
        50
      )
    );
    circle(this.x, this.y, this.size);
  }
}
