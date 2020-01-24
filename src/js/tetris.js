import I from './i';
import J from './j';
import L from './l';
import O from './o';
import S from './s';
import T from './t';
import Z from './z';
import Block from './block';
import { CONSTANTS } from './values';

const SHAPES = [I, J, L, O, S, T, Z];
const KEYS = {
  left: 37,
  right: 39,
  down: 40,
  r: 82,
  space: 32
};
function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export default class Tetris {
  constructor({ container, unitSize }) {
    this.container = container;
    this.unitSize = unitSize;
    this.blocks = [];
    this.round = 1;
    this.pause = false;
    this.speed = 1000;
    this.score = 0;
    this.highScore = 0;
  }

  get elements() {
    return {
      score: document.querySelector('.score__value'),
      highScore: document.querySelector('.high-score__value'),
      nextShape: document.querySelector('.next-shape__object'),
      pause: document.querySelector('.pause'),
      tetris: document.querySelector('.tetris'),
      gameOver: document.querySelector('.game-over')
    };
  }

  start() {
    this.setupListeners();
    this.gameOver = false;
    this.shape = this.getRandomShape();
    // this.shape.draw(this.container);
    // this.drawNextShape();
    // this.loop();
    this.drawShape();
  }

  drawShape() {
    this.shape.y = -2;
    this.shape.draw(this.container);
    this.drawNextShape();
    this.moveCurrentShape();
  }

  async moveCurrentShape() {
    if (!this.shape.tryMoveDown(this.blocks)) {
      if (this.checkIsGameOver()) {
        this.onGameOver();
      } else {
        this.saveBlocks();
        this.checkFilledRow();
        this.accelaration();
        this.shape = this.nextShape;
        this.drawShape();
      }
    } else {
      await sleep(this.speed);
      if (!this.pause) {
        this.moveCurrentShape();
      }
    }

  }

  drawNextShape() {
    this.clearNextShape();
    this.nextShape = this.getRandomShape();
    let clone = this.nextShape.clone();
    clone.x = 0;
    clone.y = 0;
    clone.draw(this.elements.nextShape);
  }

  onGameOver() {
    this.elements.gameOver.style.display = 'block';
    this.highScore = Math.max(this.highScore, this.score);
    this.elements.highScore.innerHTML = this.highScore;
    this.gameOver = true;
    this.removeListeners();
  }

  // async loop() {
  //   await sleep(this.speed);
  //   if (this.shape.canMoveDown(this.blocks)) {
  //     this.shape.move(0, 1);
  //   } else {
  //     this.blocks = [...this.blocks, ...this.shape.blocks];
  //     this.checkFilledRow();
  //     this.round++;
  //     if (this.round % 10 === 0) {
  //       this.speed *= 0.9;
  //     }
  //     this.shape = this.nextShape;
  //     this.shape.draw(this.container);
  //     this.clearNextShape();
  //     this.drawNextShape();
  //     if (this.checkIsGameOver()) {
  //       this.onGameOver();
  //       return;
  //     }
  //   }
  //   if (!this.pause) {
  //     this.loop();
  //   }
  // }

  saveBlocks() {
    this.blocks = [...this.blocks, ...this.shape.blocks];
  }

  accelaration() {
    this.round++;
    if (this.round % 10 === 0) {
      this.speed *= 0.9;
    }
  }

  getRandomShape() {
    return new SHAPES[Math.floor(Math.random() * Math.floor(SHAPES.length))]({
      x: Math.floor(CONSTANTS.tetrisWidth * 0.4),
      y: -2,
      container: this.container,
      rotation: 0,
      unitSize: this.unitSize
    });
  }

  setupListeners() {
    this.onKeyDown = event => {
      switch (event.keyCode) {
        case KEYS.left:
          if (!this.pause) {
            this.shape.tryMoveLeft(this.blocks);
          }
          break;
        case KEYS.right:
          if (!this.pause) {
            this.shape.tryMoveRight(this.blocks);
          }
          break;
        case KEYS.down:
          if (!this.pause) {
            this.shape.tryMoveDown(this.blocks);
          }
          break;
        case KEYS.r:
          if (!this.pause) {
            this.shape.tryRotate(this.blocks);
          }
          break;
        case KEYS.space:
          this.pauseGame();
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', this.onKeyDown);

    this.onPauseClick = () => {
      this.pauseGame();
    };
    this.elements.pause.addEventListener('click', this.onPauseClick);
  }

  removeListeners() {
    document.removeEventListener('keydown', this.onKeyDown);
    this.elements.pause.removeEventListener('click', this.onPauseClick);
  }

  // moveDown() {
  //   if (!this.pause && this.shape.canMoveDown(this.blocks)) {
  //     this.shape.move(0, 1);
  //   }
  // }

  // moveLeft() {
  //   if (!this.pause && this.shape.canMoveLeft(this.blocks)) {
  //     this.shape.move(-1, 0);
  //   }
  // }

  // moveRight() {
  //   if (!this.pause && this.shape.canMoveRight(this.blocks)) {
  //     this.shape.move(1, 0);
  //   }
  // }

  // rotate() {
  //   if (!this.pause && this.shape.canRotate(this.blocks)) {
  //     this.shape.rotate();
  //   }
  // }

  checkFilledRow() {
    let rows = [];
    let toRemove = [];
    this.blocks.forEach(block => {
      rows[block.y] = rows[block.y] ? [...rows[block.y], block] : [block];
    });
    rows.forEach((blocks, index) => {
      if (blocks.length === CONSTANTS.tetrisWidth) {
        toRemove.push(index);
        this.removeBlocks(blocks);
      }
    });
    if (toRemove.length > 0) {
      this.score += toRemove.length;
      this.elements.score.innerHTML = this.score;
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
    return this.blocks.some(block => block.y <= 0);
  }

  clearNextShape() {
    this.elements.nextShape.innerHTML = '';
  }

  clearAll() {
    this.clearNextShape();
    let main = this.elements.tetris;
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    this.blocks = [];
    this.round = 1;
    this.pause = false;
    this.speed = 1000;
    this.score = 0;
    this.elements.score.innerHTML = this.score;
    this.elements.gameOver.style.display = 'none';
  }

  pauseGame() {
    if (this.pause) {
      this.elements.pause.innerHTML = 'Pause';
      this.pause = false;
      this.moveCurrentShape();
    } else {
      this.elements.pause.innerHTML = 'Continue';
      this.pause = true;
    }
  }
}