import './styles/main.scss';
// import Block from './js/block';
// import I from './js/i';
import I from './js/i';

let container = document.querySelector('.tetris');
// let block = new Block({ x: 0, y: 0, color: 'cyan', unitSize: 20 });
// block.draw(container);
let shape = new I({ x: 0, y: 0, unitSize: 20, rotation: 0 });
shape.draw(container);