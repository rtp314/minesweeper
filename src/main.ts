import MinesweeperGame from './MinesweeperGame';
import './style.scss';
import Window from './Window';

const minesweeperParentElement = document.getElementById('game');

if (minesweeperParentElement) {
  new MinesweeperGame(minesweeperParentElement);
}

let minesweeperWindow: Window | null = null;

const minesweeperWindowElement = document.querySelector<HTMLDivElement>('.window');
if (minesweeperWindowElement) {
  minesweeperWindow = new Window({ element: minesweeperWindowElement, top: 50, left: 50 });
  minesweeperWindow.hide();
}

const minesweeperButton = document.getElementById('minesweeper-button');
minesweeperButton?.addEventListener('dblclick', () => {
  minesweeperWindow?.show();
});

export default {};
