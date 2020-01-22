import './styles/main.scss';
import Tetris from './js/tetris';
import { Values } from './js/values';

let container = document.querySelector('.tetris');
let tetris = new Tetris({ container, unitSize: Values.unitSize });
container.style.width = `${Values.unitSize * Values.tetrisWidth}px`;
container.style.height = `${Values.unitSize * Values.tetrisWidth * 2}px`;
tetris.start();