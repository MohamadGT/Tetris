import './styles/main.scss';
import Tetris from './js/tetris';

let container = document.querySelector('.tetris');
let tetris = new Tetris({ container, unitSize: 20 });
tetris.start();