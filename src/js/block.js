export default class Block {
  constructor({ x, y, unitSize, color }) {
    this.x = x;
    this.y = y;
    this.unitSize = unitSize;
    this.color = color;
  }

  draw(container) {
    let div = document.createElement('div');
    div.classList.add('block');
    div.classList.add(`block_color_${this.color}`);
    div.style.top = `${this.y * this.unitSize}px`;
    div.style.left = `${this.x * this.unitSize}px`;
    div.style.width = `${this.unitSize}px`;
    div.style.height = `${this.unitSize}px`;
    container.append(div);
  }
}