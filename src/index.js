import './styles/main.scss';
import GridManager from './js/grid-manager';
import Tetris from './js/tetris';

(() => {
  let container = document.querySelector('.tetris');
  let gridManager = new GridManager({ container });
  let tetris = new Tetris({ gridManager });

  document.querySelector('.new-game').addEventListener('click', () => {
    if (!tetris.isRunning) {
      if (tetris.gameOver) {
        tetris.clearAll();
      }
      tetris.start();
    }
  });
})();

