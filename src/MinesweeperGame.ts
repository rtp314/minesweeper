import Minefield from './Minefield';
import type { MinefieldInitialiserObject } from './Minefield';

const presetOptions: { [level: string]: any } = {
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

export default class MinesweeperGame {
  // HTML Elements
  parentElement: HTMLElement;
  newGameButton: HTMLButtonElement;
  minefieldDiv: HTMLDivElement;
  // JS Elements
  gameOptions: MinefieldInitialiserObject;
  minefield: Minefield;

  constructor(parent: HTMLElement) {
    // check that necessary elements are present first, else throw an error
    const newGameButton = parent.querySelector<HTMLButtonElement>('#new-game-button');
    const minefieldDiv = parent.querySelector<HTMLDivElement>('#minefield');
    const dropdownMenuButtons = parent.querySelectorAll<HTMLElement>('.dropdown-menu-button');
    const difficultySelectorButtons = parent.querySelectorAll<HTMLButtonElement>('.difficulty-selector-button');
    if (!newGameButton || !minefieldDiv || dropdownMenuButtons.length === 0 || difficultySelectorButtons.length === 0) {
      throw new Error('missing elements, please check html');
    }

    // assign variables
    this.newGameButton = newGameButton;
    this.minefieldDiv = minefieldDiv;
    this.parentElement = parent;
    this.gameOptions = { parent: this.minefieldDiv, ...presetOptions.medium };
    this.minefield = new Minefield(this.gameOptions);

    // add event listeners
    this.newGameButton.addEventListener('click', () => this.startNewGame());

    dropdownMenuButtons.forEach(button => {
      button.addEventListener('click', event => {
        // TODO: add dropdown button logic
      });
    });

    difficultySelectorButtons.forEach(button => {
      button.addEventListener('click', event => {
        const target = event.target as HTMLButtonElement;
        const level = target.dataset.difficulty;
        if (level && presetOptions[level]) {
          this.gameOptions = { ...this.gameOptions, ...presetOptions[level] };
          this.startNewGame();
        } else if (level === 'custom') {
          // TODO: show dialog
        }
      });
    });
  }

  public startNewGame() {
    if (this.minefield) this.minefield.reset();
    this.minefield = new Minefield(this.gameOptions);
  }
}
