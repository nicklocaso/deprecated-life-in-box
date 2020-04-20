"use strict";

const genLen = 56;

class Genoma {
  constructor(value) {
    this._value = value || [Genoma.generate(genLen), Genoma.generate(genLen)];
  }

  static generate(len) {
    let result = [];
    while (result.length < len) {
      result = [...result, getRandomInt(0, 1)];
    }
    return result;
  }

  static compatible(a, b) {}

  static mate(a, b) {
    if (a.getSex() !== b.getSex()) {
      let crossover = 5;
      let aGenoma = a.getValue();
      let bGenoma = b.getValue();
      for (let i = crossover - 1; i < genLen; i++) {
        let _a = aGenoma[i];
        aGenoma[i] = bGenoma[i];
        bGenoma[i] = _a;
      }
      let mutate = getRandomInt(0, genLen - 1);
      aGenoma[mutate] = aGenoma[mutate] === 1 ? 0 : 1;
      mutate = getRandomInt(0, genLen - 1);
      bGenoma[mutate] = bGenoma[mutate] === 1 ? 0 : 1;
      return new Genoma(
        getRandomInt(0, 1) === 0 ? [aGenoma, bGenoma] : [bGenoma, aGenoma]
      );
    }
  }

  changeSex() {
    this._value[0][0] = this.getSex() == 0 ? 1 : 0;
  }

  getValue() {
    // The first bit decide sex
    return this._value[this.getSex()];
  }

  getSex() {
    // 0 - Female, 1 - Male
    return this._value[0][0];
  }

  getSize() {
    let me = this.getValue();
    return parseInt(me.slice(6, 10).join(""), 2);
  }

  getEggs() {
    let me = this.getValue(); // 3 dig
    return parseInt(me.slice(11, 14).join(""), 2);
  }

  getLife() {
    let me = this.getValue(); // 4 dig
    return parseInt(me.slice(21, 25).join(""), 2);
  }

  getColors() {
    let me = this.getValue(); // 4 dig
    let rr = 17 * parseInt(me.slice(30, 34).join(""), 2);
    let bb = 17 * parseInt(me.slice(34, 38).join(""), 2);
    let gg = 17 * parseInt(me.slice(38, 42).join(""), 2);
    return { rr, bb, gg };
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso
}

let g = new Genoma();

// console.log(g._value[0].join(""));
// console.log(g._value[1].join(""));

// console.log(g.getColors());
