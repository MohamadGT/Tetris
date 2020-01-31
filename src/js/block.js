export default class Block {
  constructor({ x, y, unitSize, color }) {
    this.x = x;
    this.y = y;
    this.unitSize = unitSize;
    this.color = color;
  }

  serialize() {
    return { x: this.x, y: this.y, unitSize: this.unitSize, color: this.color };
  }

  getHtmlElement(isGhost) {
    this.div = document.createElement('div');
    this.div.classList.add('block');
    if (isGhost) {
      this.div.classList.add('ghost');
    }
    this.div.classList.add(`block_color_${this.color}`);
    this.div.style.top = `${this.y * this.unitSize}px`;
    this.div.style.left = `${this.x * this.unitSize}px`;
    this.div.style.width = `${this.unitSize}px`;
    this.div.style.height = `${this.unitSize}px`;
    return this.div;
  }
}