import I from './i';
import J from './j';
import L from './l';
import O from './o';
import S from './s';
import T from './t';
import Z from './z';
import Block from './block';
import { Values } from './values';

const SHAPES = [I, J, L, O, S, T, Z];

export default class Tetris {
  constructor({ container, unitSize }) {
    this.container = container;
    this.unitSize = unitSize;
    this.blocks = [];
    this.round = 1;
    this.pause = false;
    this.speed = 1000;
    this.score = 0;
    this.scoreElement = document.querySelector('.score__value');
  }

  start() {
    this.setupListeners();
    this.shape = this.getRandomShape();
    this.nextShape = this.getRandomShape();
    this.nextShape.draw(document.querySelector('.next-shape__object'));
    this.shape.draw(this.container);
    this.loop();
  }

  loop() {
    this.sleep(this.speed).then(() => {
      if (this.shape.canMoveDown(this.blocks)) {
        this.shape.move(0, 1);
      } else {
        this.blocks = [...this.blocks, ...this.shape.blocks];
        this.checkFilledRow();
        this.round++;
        if (this.round % 10 === 0) {
          this.speed *= 0.9;
        }
        this.shape = this.nextShape;
        this.clearNextShape();
        this.nextShape = this.getRandomShape();
        this.nextShape.draw(document.querySelector('.next-shape__object'));
        this.shape.draw(this.container);
        if (this.checkIsGameOver()) {
          console.log('Game Over');
          return;
        }
      }
      if (!this.pause) {
        this.loop();
      }
    });
  }

  getRandomShape() {
    return new SHAPES[Math.floor(Math.random() * Math.floor(SHAPES.length))]({
      x: 0,
      y: 0,
      container: this.container,
      rotation: 0,
      unitSize: this.unitSize
    });
  }

  setupListeners() {
    document.addEventListener('keydown', event => {
      switch (event.keyCode) {
        case 37:
          // left
          this.moveLeft();
          break;
        case 39:
          // right
          this.moveRight();
          break;
        case 40:
          // down
          this.moveDown();
          break;
        case 82:
          // r
          this.rotate();
          break;
        case 32:
          // space => pause
          if (this.pause) {
            this.pause = false;
            this.loop();
          } else {
            this.pause = true;
          }
          break;
        default:
          break;
      }
    });
  }

  moveDown() {
    if (this.shape.canMoveDown(this.blocks)) {
      this.shape.move(0, 1);
    }
  }

  moveLeft() {
    if (this.shape.canMoveLeft(this.blocks)) {
      this.shape.move(-1, 0);
    }
  }

  moveRight() {
    if (this.shape.canMoveRight(this.blocks)) {
      this.shape.move(1, 0);
    }
  }

  rotate() {
    if (this.shape.canRotate(this.blocks)) {
      this.shape.rotate();
    }
  }

  sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  checkFilledRow() {
    let rows = [];
    let toRemove = [];
    this.blocks.forEach(block => {
      rows[block.y] = rows[block.y] ? [...rows[block.y], block] : [block];
    });
    rows.forEach((blocks, index) => {
      if (blocks.length === Values.tetrisWidth) {
        toRemove.push(index);
        this.removeBlocks(blocks);
      }
    });
    if (toRemove.length > 0) {
      this.score += toRemove.length;
      this.scoreElement.innerHTML = this.score;
      this.blocks.forEach(block => this.container.removeChild(block.div));
      this.blocks = this.blocks.map(block => new Block({
        x: block.x,
        y: block.y + toRemove.filter(y => y > block.y).length,
        unitSize: block.unitSize,
        color: block.color
      }));
      this.blocks.forEach(block => block.draw(this.container));
    }
  }

  removeBlocks(blocks) {
    blocks.forEach(block => {
      this.blocks.splice(this.blocks.indexOf(block), 1);
      this.container.removeChild(block.div);
    });
  }

  checkIsGameOver() {
    return this.blocks.findIndex(block => block.y === 0) !== -1;
  }

  clearNextShape() {
    let next = document.querySelector('.next-shape__object');
    while (next.firstChild) {
      next.removeChild(next.firstChild);
    }
  }
}