"use strict";

class Genoma {
  constructor(genoma) {
    if (genoma) {
      this.DNA = Object.assign({}, genoma.DNA);
    } else {
      this.DNA = Genoma.createDNA();
    }
  }

  static get length() {
    return 56;
  }

  static get crossover() {
    return 10;
  }

  static createDNA() {
    return { x: _gen(Genoma.length), y: _gen(Genoma.length) };
    function _gen(len) {
      let result = [];
      while (result.length < len) {
        result = [...result, getRandomInt(0, 1)];
      }
      return result.join("");
    }
  }

  getRuling() {
    // Ruling genoma: 0XXX000000...
    return parseInt(this.DNA.x.substr(1, 3), 2) >=
      parseInt(this.DNA.y.substr(1, 3), 2)
      ? this.DNA.x
      : this.DNA.y;
  }

  getKey() {
    // Compatibility: 15% of dna tail
    let p = (Genoma.length * 1.5) / 10;
    return this.getRuling().substr(Genoma.length - p);
  }

  mutate() {
    let xGenoma = this.DNA.x.split("");
    let yGenoma = this.DNA.y.split("");

    let mutate = getRandomInt(0, Genoma.length - 1);
    xGenoma[mutate] = xGenoma[mutate] == "0" ? "1" : "0";
    mutate = getRandomInt(0, Genoma.length - 1);
    yGenoma[mutate] = yGenoma[mutate] == "0" ? "1" : "0";

    this.DNA.x = xGenoma.join("");
    this.DNA.y = yGenoma.join("");
  }

  getSex() {
    // False: Female - True: Male
    let bits = parseInt(this.getRuling().substr(0, 6), 2);
    let string = this.getRuling().substr(3, bits);
    let sex = 0;
    for (let char of string) {
      sex += parseInt(char, 2);
    }
    return sex % 2 == 1 ? true : false;
  }

  getColors() {
    let _r = parseInt(this.getRuling().substr(20, 8), 2);
    let _g = parseInt(this.getRuling().substr(30, 8), 2);
    let _b = parseInt(this.getRuling().substr(40, 8), 2);
    return {
      r: _r > 255 ? 255 : _r,
      g: _g > 255 ? 255 : _g,
      b: _b > 255 ? 255 : _b
    };
  }

  reproduce(partner) {
    if (
      this.getKey() == partner.getKey() &&
      !this.getSex() &&
      partner.getSex()
    ) {
      let xGenoma = this.DNA.x.split("");
      let yGenoma = this.DNA.y.split("");
      // Switching genoma
      for (let i = Genoma.crossover - 1; i < Genoma.length; i++) {
        let xx = xGenoma[i];
        xGenoma[i] = yGenoma[i];
        yGenoma[i] = xx;
      }
      // Mutate 1 bit per genoma
      let mutate = getRandomInt(0, Genoma.length - 1);
      xGenoma[mutate] = xGenoma[mutate] == "0" ? "1" : "0";
      mutate = getRandomInt(0, Genoma.length - 1);
      yGenoma[mutate] = yGenoma[mutate] == "0" ? "1" : "0";
      return new Genoma({ DNA: { x: xGenoma.join(""), y: yGenoma.join("") } });
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso
}
