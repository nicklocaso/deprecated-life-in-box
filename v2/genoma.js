"use strict";

class Genoma {
  static globals = {
    FEMALE: 0,
    MALE: 1,
    SEX: 0,
    RED: 1,
    GREEN: 2,
    BLUE: 3,
    SIZE: 4
  };

  static DNA_MASTER =
    // Line guides of genoma max values
    // 1' Max Possible
    // 2' Delta each mutation
    [
      // Sex
      [1, 1],
      // RGB Color
      [255, 0.2],
      [255, 0.2],
      [255, 0.2],
      // Size
      [40, 0.2],
      // Active or Passive
      [50, 0.5],
      // Others
      [50, 0.5],
      [50, 0.5],
      [50, 0.5],
      [50, 0.5]
    ];

  static generateDNA() {
    let dna = [];
    for (let i = 0; i < Genoma.DNA_MASTER.length; i++) {
      dna.push(getRandomInt(0, Genoma.DNA_MASTER[i][0]));
    }
    return dna;
  }

  constructor(genoma) {
    if (genoma instanceof Genoma || typeof genoma === "object")
      this.DNA = genoma.DNA.slice(0);
    else this.DNA = Genoma.generateDNA();
  }

  getSEX() {
    return this.DNA[Genoma.globals.SEX];
  }

  getRED() {
    return this.DNA[Genoma.globals.RED];
  }

  getGREEN() {
    return this.DNA[Genoma.globals.GREEN];
  }

  getBLUE() {
    return this.DNA[Genoma.globals.BLUE];
  }

  getSIZE() {
    return 10 + this.DNA[Genoma.globals.SIZE];
  }

  mutate(nMutations) {
    if (!nMutations || nMutations < 1) nMutations = 1;
    for (let i = 0; i < nMutations; i++) {
      let index = getRandomInt(0, Genoma.DNA_MASTER.length - 1);
      let delta = Genoma.DNA_MASTER[index][1];
      let seed = Math.random() * delta + 1 - delta / 2;
      let value = this.DNA[index] || 1;
      value = Math.floor(value * seed);
      if (value < 0) value = 0;
      if (value > Genoma.DNA_MASTER[index][0])
        value = Genoma.DNA_MASTER[index][0];
      this.DNA[index] = value;
    }
  }

  compatible(other) {
    for (let i = 1; i < Genoma.DNA_MASTER.length; i++) {
      let _a = (Genoma.DNA_MASTER[i][1] / 2) * this.DNA[i];
      let _b = (Genoma.DNA_MASTER[i][1] / 2) * other.DNA[i];
      let delta = Math.abs(this.DNA[i] - other.DNA[i]);
      if (_a + _b < delta) return false;
    }
    return true;
  }

  reproduce(other) {
    if (this.getSEX() == Genoma.globals.FEMALE) {
      if (other.getSEX() == Genoma.globals.MALE) {
        if (this.compatible(other)) {
          let crossover = Genoma.DNA_MASTER.length / 3;
          let active = [];
          let passive = [];
          if (this.DNA[5] >= other.DNA[5]) {
            active = this.DNA.slice(0);
            passive = other.DNA.slice(0);
          } else {
            passive = this.DNA.slice(0);
            active = other.DNA.slice(0);
          }
          for (let i = crossover; i < Genoma.DNA_MASTER.length; i++) {
            active[i] = passive[i];
          }
          let son = new Genoma({ DNA: active });
          son.mutate(3);
          return son;
        }
      }
    }
  }
}
