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

  moveBlocks() {
    let options = this.constructor.blockOptions[this.rotation];
    return options.map(point => new Block({
      x: point.x + this.x,
      y: point.y + this.y,
      unitSize: this.unitSize,
      color: this.constructor.color
    }));
  }

  draw(container) {
    this.blocks.forEach(block => container.append(block.getHtmlElement()));
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

  checkCollision(blocks) {
    return blocks.every(block => block.x >= 0 && block.x <= (CONSTANTS.tetrisWidth - 1) && block.y <= ((CONSTANTS.tetrisWidth * 2) - 1))
    && this.gridManager.blocks.every(block => !blocks.some(b => b.x === block.x && b.y === block.y));
  }

  simulateMove(callback) {
    let { x, y, rotation } = this;
    callback();
    this.blocks.forEach(block => this.container.removeChild(block.div));
    let blocks = this.moveBlocks();
    if (this.checkCollision(blocks)) {
      this.blocks = blocks;
      this.draw(this.container);
      return true;
    }
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.draw(this.container);
    return false;
  }
}