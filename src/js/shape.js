import Block from './block';
import { CONSTANTS } from './values';

export default class Shape {
  constructor({ x, y, container, rotation, unitSize }) {
    this.x = x;
    this.y = y;
    this.container = container;
    this.rotation = rotation;
    this.unitSize = unitSize;
    this.blocks = [];
  }

  draw(container) {
    let options = this.constructor.blockOptions[this.rotation];
    let blocks = options.map(point => new Block({
      x: point.x + this.x,
      y: point.y + this.y,
      unitSize: this.unitSize,
      color: this.constructor.color
    }));
    blocks.forEach(block => {
      block.draw(container);
    });
    this.blocks = blocks;
  }

  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  tryMoveLeft(oldBlocks) {
    if (this.blocks.every(block => block.x !== 0)
        && oldBlocks.every(block => !this.blocks.some(b => (b.x - 1) === block.x && b.y === block.y))) {
      this.move(-1, 0);
      return true;
    }
    return false;
  }

  tryMoveRight(oldBlocks) {
    if (this.blocks.every(block => block.x !== (CONSTANTS.tetrisWidth - 1))
        && oldBlocks.every(block => !this.blocks.some(b => (b.x + 1) === block.x && b.y === block.y))) {
      this.move(1, 0);
      return true;
    }
    return false;
  }

  tryMoveDown(oldBlocks) {
    if (this.blocks.every(block => block.y !== ((CONSTANTS.tetrisWidth * 2) - 1))
        && oldBlocks.every(block => !this.blocks.some(b => b.x === block.x && (b.y + 1) === block.y))) {
      this.move(0, 1);
      return true;
    }
    return false;
  }

  tryRotate(oldBlocks) {
    let newRotation = (this.rotation + 90) % 360;
    let options = this.constructor.blockOptions[newRotation];
    let blocks = options.map(point => new Block({
      x: point.x + this.x,
      y: point.y + this.y,
      unitSize: this.unitSize,
      color: this.constructor.color
    }));
    if (blocks.every(block => block.x >= 0 && block.x <= (CONSTANTS.tetrisWidth - 1) && block.y <= ((CONSTANTS.tetrisWidth * 2) - 1))
        && oldBlocks.every(block => !blocks.some(b => b.x === block.x && b.y === block.y))) {
      this.rotate();
      return true;
    }
    return false;
  }

  move(x, y) {
    this.x += x;
    this.y += y;
    this.blocks.forEach(block => this.container.removeChild(block.div));
    this.draw(this.container);
  }

  rotate() {
    this.rotation = (this.rotation + 90) % 360;
    this.blocks.forEach(block => this.container.removeChild(block.div));
    this.draw(this.container);
  }
}