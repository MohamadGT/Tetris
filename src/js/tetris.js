import I from './i';
import J from './j';
import L from './l';
import O from './o';
import S from './s';
import T from './t';
import Z from './z';
import { CONSTANTS } from './values';

const SHAPES = [I, J, L, O, S, T, Z];
const KEYS = {
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  r: 82
};

export default class Tetris {
  constructor({ gridManager }) {
    this.gridManager = gridManager;
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
    this.isRunning = true;
    this.setupListeners();
    this.gameOver = false;
    this.shape = this.getRandomShape();
    this.drawShape();
  }

  drawShape() {
    this.shape.x = Math.floor(CONSTANTS.tetrisWidth * 0.4);
    this.shape.y = -2;
    this.shape.draw(this.elements.tetris);
    this.drawNextShape();
    this.moveCurrentShape();
  }

  sleep(time) {
    return new Promise(resolve => {
      let id = this.sleepId;
      setTimeout(() => {
        if (id === this.sleepId) {
          resolve();
        }
      }, time);
    });
  }

  async moveCurrentShape() {
    if (!this.shape.moveDown()) {
      this.moveFast = false;
      this.saveBlocks();
      if (this.checkIsGameOver()) {
        this.onGameOver();
      } else {
        this.score += this.gridManager.manageGrid();
        this.elements.score.innerHTML = this.score;
        this.accelaration();
        this.shape = this.nextShape;
        this.drawShape();
      }
    } else {
      if (this.moveFast) {
        await this.sleep(50);
      } else {
        await this.sleep(this.speed);
      }
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
    this.isRunning = false;
  }

  saveBlocks() {
    this.gridManager.blocks = [...this.gridManager.blocks, ...this.shape.blocks];
  }

  accelaration() {
    this.round++;
    if (this.round % 10 === 0) {
      this.speed *= 0.9;
    }
  }

  getRandomShape() {
    return new SHAPES[Math.floor(Math.random() * Math.floor(SHAPES.length))]({
      x: 0,
      y: 0,
      container: this.elements.tetris,
      rotation: 0,
      unitSize: this.gridManager.unitSize,
      gridManager: this.gridManager
    });
  }

  setupListeners() {
    this.onKeyDown = event => {
      switch (event.keyCode) {
        case KEYS.left:
          if (!this.pause) {
            this.shape.moveLeft();
          }
          break;
        case KEYS.right:
          if (!this.pause) {
            this.shape.moveRight();
          }
          break;
        case KEYS.down:
          if (!this.pause) {
            this.shape.moveDown();
          }
          break;
        case KEYS.up:
          if (!this.pause) {
            this.sleepId = {};
            this.moveFast = true;
            this.moveCurrentShape();
          }
          break;
        case KEYS.r:
          if (!this.pause) {
            this.shape.rotate();
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

  checkIsGameOver() {
    return this.gridManager.blocks.some(block => block.y <= 0);
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
    this.gridManager.blocks = [];
    this.round = 1;
    this.pause = false;
    this.speed = 1000;
    this.score = 0;
    this.elements.score.innerHTML = this.score;
    this.elements.gameOver.style.display = 'none';
  }

  pauseGame() {
    this.sleepId = {};
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