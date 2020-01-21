import Block from './block';

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

  canMoveLeft() {
    return this.blocks.findIndex(block => block.x === 0) === -1;
  }

  canMoveRight() {
    return this.blocks.findIndex(block => block.x === 19) === -1;
  }

  canMoveDown() {
    return this.blocks.findIndex(block => block.y === 39) === -1;
  }

  canRotate() {
    let newRotation = (this.rotation + 90) % 360;
    let options = this.constructor.blockOptions[newRotation];
    let blocks = options.map(point => new Block({
      x: point.x + this.x,
      y: point.y + this.y,
      unitSize: this.unitSize,
      color: this.constructor.color
    }));
    return blocks.findIndex(block => block.x < 0 || block.x > 19 || block.y > 39) === -1;
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