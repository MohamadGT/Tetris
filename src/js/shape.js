import Block from './block';
import { Values } from './values';

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

  canMoveLeft(oldBlocks) {
    return this.blocks.findIndex(block => block.x === 0) === -1
      && oldBlocks.findIndex(block => this.blocks.findIndex(b => (b.x - 1) === block.x && b.y === block.y) !== -1) === -1;
  }

  canMoveRight(oldBlocks) {
    return this.blocks.findIndex(block => block.x === (Values.tetrisWidth - 1)) === -1
      && oldBlocks.findIndex(block => this.blocks.findIndex(b => (b.x + 1) === block.x && b.y === block.y) !== -1) === -1;
  }

  canMoveDown(oldBlocks) {
    return this.blocks.findIndex(block => block.y === ((Values.tetrisWidth * 2) - 1)) === -1
      && oldBlocks.findIndex(block => this.blocks.findIndex(b => b.x === block.x && (b.y + 1) === block.y) !== -1) === -1;
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
    return blocks.findIndex(block => block.x < 0 || block.x > (Values.tetrisWidth - 1) || block.y > ((Values.tetrisWidth * 2) - 1)) === -1
      && oldBlocks.findIndex(block => blocks.findIndex(b => b.x === block.x && b.y === block.y) !== -1) === -1;
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