import MinesweeperGame from './MinesweeperGame';
import './style.scss';
import Window from './Window';

const minesweeperParentElement = document.getElementById('game');

if (minesweeperParentElement) {
  new MinesweeperGame(minesweeperParentElement);
}

const minesweeperWindowElement = document.querySelector<HTMLDivElement>('.window');
if (minesweeperWindowElement) new Window({ element: minesweeperWindowElement, top: 50, left: 50 });

export default {};
