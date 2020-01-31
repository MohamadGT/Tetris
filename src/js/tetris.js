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
const FASTSLEEP = 5;

export default class Tetris {
  constructor({ gridManager }) {
    this.gridManager = gridManager;
    this.round = 1;
    this.isPaused = false;
    this.score = 0;
    this.highScore = 0;
    this.elements.pause.style.display = 'none';
  }

  get elements() {
    return {
      score: document.querySelector('.score__value'),
      highScore: document.querySelector('.high-score__value'),
      nextShape: document.querySelector('.next-shape__object'),
      pause: document.querySelector('.pause'),
      tetris: document.querySelector('.tetris'),
      gameOver: document.querySelector('.game-over'),
      tetrisScore: document.querySelector('.tetris-score')
    };
  }

  start() {
    this.sleepId = {};
    this.isRunning = true;
    this.setupListeners();
    this.gameOver = false;
    if (!this.isLoaded) {
      this.shape = this.getRandomShape();
    } else {
      this.elements.pause.innerHTML = 'Continue';
    }
    this.elements.pause.style.display = 'block';
    this.drawShape();
  }

  drawShape() {
    if (!this.isLoaded) {
      this.shape.x = Math.floor(CONSTANTS.tetrisWidth * 0.4);
      this.shape.y = -2;
      this.shape.draw(this.elements.tetris);
    }
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
        this.round++;
        this.shape = this.nextShape;
        this.drawShape();
        this.saveGame();
      }
    } else {
      await this.sleep(this.moveFast ? FASTSLEEP : this.getSleepDuration());
      this.saveGame();
      if (!this.isPaused) {
        this.moveCurrentShape();
      }
    }
  }

  drawNextShape() {
    if (!this.isLoaded) {
      this.clearNextShape();
      this.nextShape = this.getRandomShape();
      this.nextShape.draw(this.elements.nextShape);
    }
    this.isLoaded = false;
  }

  onGameOver() {
    this.elements.gameOver.style.display = 'block';
    this.highScore = Math.max(this.highScore, this.score);
    this.elements.highScore.innerHTML = this.highScore;
    this.gameOver = true;
    this.removeListeners();
    this.isRunning = false;
    this.isLoaded = false;
    localStorage.removeItem('tetris');
    this.elements.pause.style.display = 'none';
  }

  saveBlocks() {
    this.gridManager.blocks = [...this.gridManager.blocks, ...this.shape.blocks];
    let removedRows = this.gridManager.manageGrid();
    if (removedRows >= 4) {
      removedRows *= 2;
      this.elements.tetrisScore.style.display = 'block';
      setTimeout(() => this.elements.tetrisScore.style.display = 'none', 1000);
    }
    this.score += removedRows;
    this.elements.score.innerHTML = this.score;
  }

  getSleepDuration() {
    return 1000 * Math.pow(0.9, Math.floor(this.round / 10));
  }

  getRandomShape() {
    return new SHAPES[Math.floor(Math.random() * SHAPES.length)]({
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
      if (event.keyCode === KEYS.space) {
        this.togglePause();
      } else if (!this.isPaused) {
        switch (event.keyCode) {
          case KEYS.left:
            this.shape.moveLeft();
            break;
          case KEYS.right:
            this.shape.moveRight();
            break;
          case KEYS.down:
            this.shape.moveDown();
            break;
          case KEYS.up:
            this.sleepId = {};
            this.moveFast = true;
            this.moveCurrentShape();
            break;
          case KEYS.r:
            this.shape.rotate();
            break;
          default:
            break;
        }
      }
    };
    document.addEventListener('keydown', this.onKeyDown);

    this.onPauseClick = () => {
      this.togglePause();
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
    this.elements.tetris.innerHTML = '';
    this.gridManager.blocks = [];
    this.round = 1;
    this.isPaused = false;
    this.score = 0;
    this.elements.score.innerHTML = this.score;
    this.elements.gameOver.style.display = 'none';
    this.elements.pause.innerHTML = 'Pause';
  }

  togglePause() {
    this.sleepId = {};
    if (this.isPaused) {
      this.elements.pause.innerHTML = 'Pause';
      this.isPaused = false;
      this.moveCurrentShape();
    } else {
      this.elements.pause.innerHTML = 'Continue';
      this.isPaused = true;
    }
  }

  serialize() {
    let blocks = this.gridManager.blocks.map(block => block.serialize());
    return JSON.stringify({
      shape: this.shape.serialize(),
      nextShape: this.nextShape.serialize(),
      round: this.round,
      isPaused: this.isPaused,
      score: this.score,
      gridBlocks: blocks
    });
  }

  deserialize(data) {
    let obj = JSON.parse(data);
    if (obj) {
      this.isLoaded = true;
      this.shape = this.loadShape(obj.shape);
      this.nextShape = this.loadShape(obj.nextShape);
      this.round = obj.round;
      this.isPaused = true;
      this.score = obj.score;
      this.elements.score.innerHTML = this.score;
      this.gridManager.loadGrid(obj.gridBlocks);
      this.shape.draw(this.elements.tetris);
      this.nextShape.draw(this.elements.nextShape);
      this.start();
    }
  }

  saveGame() {
    localStorage.setItem('tetris', this.serialize());
    localStorage.setItem('highScore', this.highScore);
  }

  loadGame() {
    this.deserialize(localStorage.getItem('tetris'));
    this.highScore = localStorage.getItem('highScore') || 0;
    this.elements.highScore.innerHTML = this.highScore;
  }

  loadShape(obj) {
    let name = obj.name;
    let Type = SHAPES.find(shape => shape.name === name);
    return new Type({
      x: obj.x,
      y: obj.y,
      container: this.elements.tetris,
      rotation: obj.rotation,
      unitSize: this.gridManager.unitSize,
      gridManager: this.gridManager
    });
  }

  restartGame() {
    this.removeListeners();
    this.isRunning = false;
    this.isLoaded = false;
    localStorage.removeItem('tetris');
    this.clearAll();
    this.start();
  }
}