import Minefield from './Minefield';
import type { MinefieldInitialiserObject } from './Minefield';
import Window from './Window';

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
  dropdownMenuButtons: NodeListOf<HTMLElement>;
  // JS Elements
  gameOptions: MinefieldInitialiserObject;
  minefield: Minefield;
  dropdownMenuOpen = false;
  customSizeWindow: Window | null = null;

  constructor(parent: HTMLElement) {
    // check that necessary elements are present first, else throw an error
    const newGameButton = parent.querySelector<HTMLButtonElement>('#new-game-button');
    const minefieldDiv = parent.querySelector<HTMLDivElement>('#minefield');
    const dropdownMenuButtons = parent.querySelectorAll<HTMLElement>('.dropdown-menu-button');
    const difficultySelectorButtons = parent.querySelectorAll<HTMLButtonElement>('.difficulty-selector-button');
    const menu = parent.querySelector('#menu');
    if (
      !newGameButton ||
      !minefieldDiv ||
      !menu ||
      dropdownMenuButtons.length === 0 ||
      difficultySelectorButtons.length === 0
    ) {
      throw new Error('missing elements, please check html');
    }

    // assign variables
    this.newGameButton = newGameButton;
    this.minefieldDiv = minefieldDiv;
    this.parentElement = parent;
    this.gameOptions = { parent: this.minefieldDiv, ...presetOptions.medium };
    this.minefield = new Minefield(this.gameOptions);
    this.dropdownMenuButtons = dropdownMenuButtons;

    // add event listeners
    this.newGameButton.addEventListener('click', () => this.startNewGame());

    dropdownMenuButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.openDropdownMenu(button);
      });

      button.addEventListener('mouseover', () => {
        if (this.dropdownMenuOpen) {
          this.openDropdownMenu(button);
        }
      });
    });

    menu.addEventListener('mouseleave', () => {
      if (!this.dropdownMenuOpen) return;
      this.closeDropdownMenus();
    });

    difficultySelectorButtons.forEach(button => {
      button.addEventListener('click', event => {
        const target = event.target as HTMLButtonElement;
        const level = target.dataset.difficulty;
        if (level && presetOptions[level]) {
          this.gameOptions = { ...this.gameOptions, ...presetOptions[level] };
          this.startNewGame();
        } else if (level === 'custom' && this.customSizeWindow) {
          this.customSizeWindow.show();
        }
        this.closeDropdownMenus();
      });
    });

    // add Window
    const popupWindowElement = parent.querySelector<HTMLDivElement>('#custom-size-select');
    if (popupWindowElement) {
      this.customSizeWindow = new Window({ element: popupWindowElement });
    } else {
      console.error('no custom size selector element found, no custom sizes will be useable');
    }
  }

  public startNewGame() {
    if (this.minefield) this.minefield.reset();
    this.minefield = new Minefield(this.gameOptions);
  }

  private openDropdownMenu(parent: HTMLElement) {
    this.dropdownMenuOpen = true;
    this.dropdownMenuButtons.forEach(button => {
      const dropdown = button.querySelector<HTMLElement>('.dropdown-menu');
      if (!dropdown) return;
      if (button === parent) {
        dropdown.style.display = 'flex';
      } else {
        dropdown.style.display = 'none';
      }
    });
  }

  private closeDropdownMenus() {
    this.dropdownMenuOpen = false;
    this.parentElement.querySelectorAll<HTMLElement>('.dropdown-menu').forEach(menu => (menu.style.display = 'none'));
  }
}
