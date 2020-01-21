import I from './i';
import J from './j';
import L from './l';
import O from './o';
import S from './s';
import T from './t';
import Z from './z';

const SHAPES = [I, J, L, O, S, T, Z];

export default class Tetris {
  constructor({ container, unitSize }) {
    this.container = container;
    this.unitSize = unitSize;
  }

  start() {
    this.setupListeners();
    this.shape = this.getRandomShape();
    console.log(this.shape);
    this.shape.draw(this.container);
  }

  getRandomShape() {
    // returns random shape class
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
        default:
          break;
      }
    });
  }

  moveDown() {
    if (this.shape.canMoveDown()) {
      this.shape.move(0, 1);
    }
  }

  moveLeft() {
    if (this.shape.canMoveLeft()) {
      this.shape.move(-1, 0);
    }
  }

  moveRight() {
    if (this.shape.canMoveRight()) {
      this.shape.move(1, 0);
    }
  }

  rotate() {
    if (this.shape.canRotate()) {
      this.shape.rotate();
    }
  }
}