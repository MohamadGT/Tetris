import { CONSTANTS } from './values';
import Block from './block';

export default class GridManager {
  static checkFilledRow(all) {
    let rows = [];
    let toRemove = [];
    let toRemoveIndexes = [];
    all.forEach(block => {
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

  static reorderBlocks(blocks, indexes, container) {
    blocks.forEach(block => container.removeChild(block.div));
    let newBlocks = blocks.map(block => new Block({
      x: block.x,
      y: block.y + indexes.filter(y => y > block.y).length,
      unitSize: block.unitSize,
      color: block.color
    }));
    newBlocks.forEach(block => block.draw(container));
    return newBlocks;
  }
}