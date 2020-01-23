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

  canMoveLeft(oldBlocks) {
    return this.blocks.every(block => block.x !== 0)
      && oldBlocks.every(block => !this.blocks.some(b => (b.x - 1) === block.x && b.y === block.y));
  }

  canMoveRight(oldBlocks) {
    return this.blocks.every(block => block.x !== (CONSTANTS.tetrisWidth - 1))
      && oldBlocks.every(block => !this.blocks.some(b => (b.x + 1) === block.x && b.y === block.y));
  }

  canMoveDown(oldBlocks) {
    return this.blocks.every(block => block.y !== ((CONSTANTS.tetrisWidth * 2) - 1))
      && oldBlocks.every(block => !this.blocks.some(b => b.x === block.x && (b.y + 1) === block.y));
  }

  canRotate(oldBlocks) {
    let newRotation = (this.rotation + 90) % 360;
    let options = this.constructor.blockOptions[newRotation];
    let blocks = options.map(point => new Block({
      x: point.x + this.x,
      y: point.y + this.y,
      unitSize: this.unitSize,
      color: this.constructor.color
    }));
    return blocks.every(block => block.x >= 0 && block.x <= (CONSTANTS.tetrisWidth - 1) && block.y <= ((CONSTANTS.tetrisWidth * 2) - 1))
      && oldBlocks.every(block => !blocks.some(b => b.x === block.x && b.y === block.y));
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