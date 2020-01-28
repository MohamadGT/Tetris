import { CONSTANTS } from './values';
import Block from './block';

export default class GridManager {
  constructor({ container }) {
    this.unitSize = CONSTANTS.unitSize;
    this.blocks = [];
    this.container = container;
    this.drawGrid();
  }

  drawGrid() {
    this.container.style.width = `${CONSTANTS.unitSize * CONSTANTS.tetrisWidth}px`;
    this.container.style.height = `${CONSTANTS.unitSize * CONSTANTS.tetrisHeight}px`;
  }

  checkFilledRow() {
    let rows = [];
    let toRemove = [];
    let toRemoveIndexes = [];
    this.blocks.forEach(block => {
      rows[block.y] = rows[block.y] ? [...rows[block.y], block] : [block];
    });
    rows.forEach((blocks, index) => {
      if (blocks.length === CONSTANTS.tetrisWidth) {
        toRemoveIndexes.push(index);
        toRemove = [...toRemove, ...blocks];
      }
    });
    return {
      indexes: toRemoveIndexes,
      remove: toRemove
    };
  }

  reorderBlocks(indexes) {
    this.blocks.forEach(block => this.container.removeChild(block.div));
    let newBlocks = this.blocks.map(block => new Block({
      x: block.x,
      y: block.y + indexes.filter(y => y > block.y).length,
      unitSize: block.unitSize,
      color: block.color
    }));
    newBlocks.forEach(block => block.draw(this.container));
    return newBlocks;
  }

  manageGrid() {
    let result = this.checkFilledRow();
    result.remove.forEach(block => {
      this.blocks.splice(this.blocks.indexOf(block), 1);
      this.container.removeChild(block.div);
    });
    if (result.indexes.length > 0) {
      console.log('here', result.indexes.length);
      this.blocks = this.reorderBlocks(result.indexes);
    }
    return result.indexes.length;
  }
}