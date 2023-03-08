import MinesweeperGame from './MinesweeperGame';
import './style.scss';

const minesweeperParentElement = document.getElementById('game');

if (minesweeperParentElement) {
  new MinesweeperGame(minesweeperParentElement);
}

export default {};
