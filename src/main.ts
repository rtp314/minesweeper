import Minefield from './Minefield';
import './style.scss';

const newGame = document.getElementById('new-game-button')!;
const minefieldDiv = document.getElementById('minefield')!;

newGame.addEventListener('click', startNewGame);

const presetOptions = {
  easy: {
    width: 10,
    height: 10,
    numberOfMines: 10,
  },
  medium: {
    width: 30,
    height: 20,
    numberOfMines: 60,
  },
  hard: {
    width: 30,
    height: 30,
    numberOfMines: 120,
  },
};

const defaultOptions = {
  parent: minefieldDiv,
  ...presetOptions.hard,
};

let oldMinefield: Minefield = new Minefield(defaultOptions);

function startNewGame() {
  if (oldMinefield) oldMinefield.reset();
  oldMinefield = new Minefield(defaultOptions);
}

export default {};
