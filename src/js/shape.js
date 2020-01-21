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
}