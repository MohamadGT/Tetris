import Block from './block';
import { CONSTANTS } from './values';

export default class Shape {
  constructor({ x, y, container, rotation, unitSize, gridManager }) {
    this.x = x;
    this.y = y;
    this.container = container;
    this.rotation = rotation;
    this.unitSize = unitSize;
    this.gridManager = gridManager;
    this.blocks = [];
    this.init();
  }

  init() {
    let options = this.constructor.blockOptions[this.rotation];
    this.blocks = options.map(point => new Block({
      x: point.x + this.x,
      y: point.y + this.y,
      unitSize: this.unitSize,
      color: this.constructor.color
    }));
  }

  draw(container) {
    this.blocks.forEach(block => block.draw(container));
  }

  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  moveDown() {
    return this.simulateMove(() =>
      this.y += 1
    );
  }

  moveLeft() {
    return this.simulateMove(() =>
      this.x -= 1
    );
  }

  moveRight() {
    return this.simulateMove(() =>
      this.x += 1
    );
  }

  rotate() {
    return this.simulateMove(() =>
      this.rotation = (this.rotation + 90) % 360
    );
  }

  simulateMove(callback) {
    let position = {
      x: this.x,
      y: this.y,
      rotaion: this.rotation
    };
    callback();
    this.blocks.forEach(block => this.container.removeChild(block.div));
    let options = this.constructor.blockOptions[this.rotation];
    let blocks = options.map(point => new Block({
      x: point.x + this.x,
      y: point.y + this.y,
      unitSize: this.unitSize,
      color: this.constructor.color
    }));
    if (blocks.every(block => block.x >= 0 && block.x <= (CONSTANTS.tetrisWidth - 1) && block.y <= ((CONSTANTS.tetrisWidth * 2) - 1))
        && this.gridManager.blocks.every(block => !blocks.some(b => b.x === block.x && b.y === block.y))) {
      this.blocks = blocks;
      this.draw(this.container);
      return true;
    }
    this.x = position.x;
    this.y = position.y;
    this.draw(this.container);
    return false;
  }
}