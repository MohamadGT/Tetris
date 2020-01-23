import './styles/main.scss';
import Tetris from './js/tetris';
import { CONSTANTS } from './js/values';

let container = document.querySelector('.tetris');
let tetris = new Tetris({ container, unitSize: CONSTANTS.unitSize });
container.style.width = `${CONSTANTS.unitSize * CONSTANTS.tetrisWidth}px`;
container.style.height = `${CONSTANTS.unitSize * CONSTANTS.tetrisHeight}px`;
document.querySelector('.new-game').addEventListener('click', () => {
  if (!tetris.isRunning) {
    if (tetris.gameOver) {
      tetris.clearAll();
    }
    tetris.start();
  }
});