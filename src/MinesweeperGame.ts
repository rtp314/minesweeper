import Minefield from './Minefield';
import type { MinefieldInitialiserObject } from './Minefield';
import Window from './Window';
import SizeSelectorWindow, { MinefieldValues } from './SizeSelectorWindow';

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
  aboutWindow: Window | null = null;
  howToPlayWindow: Window | null = null;

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
      button.addEventListener('click', event => {
        if (event.target === button) this.openDropdownMenu(button);
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

    const howToPlayButton = parent.querySelector<HTMLButtonElement>('#how-to-play-button');
    if (howToPlayButton) {
      howToPlayButton.addEventListener('click', () => {
        this.howToPlayWindow?.show();
      });
    } else {
      console.error('no How To Play button element found in HTML');
    }
    const aboutButton = parent.querySelector<HTMLButtonElement>('#about-button');
    if (aboutButton) {
      aboutButton.addEventListener('click', () => {
        this.aboutWindow?.show();
      });
    } else {
      console.error('no About button element found in HTML');
    }

    // add Windows
    const popupWindowElement = parent.querySelector<HTMLDivElement>('#custom-size-select');
    if (popupWindowElement) {
      this.customSizeWindow = new SizeSelectorWindow({
        element: popupWindowElement,
        top: 100,
        left: 100,
        setSize: this.setSize,
      });
    } else {
      console.error('no custom size selector element found, no custom sizes will be useable');
    }

    const aboutWindowElement = parent.querySelector<HTMLDivElement>('#about-window');
    if (aboutWindowElement) {
      this.aboutWindow = new Window({
        element: aboutWindowElement,
        top: 115,
        left: 115,
      });
      const closeButton = aboutWindowElement.querySelector<HTMLButtonElement>('.ok-button');
      closeButton?.addEventListener('click', () => this.aboutWindow?.hide());
    } else {
      console.error('no About window elements found');
    }
    const howToPlayElement = parent.querySelector<HTMLDivElement>('#how-to-play-window');
    if (howToPlayElement) {
      this.howToPlayWindow = new Window({
        element: howToPlayElement,
        top: 130,
        left: 130,
      });
      const closeButton = howToPlayElement.querySelector<HTMLButtonElement>('.ok-button');
      closeButton?.addEventListener('click', () => this.howToPlayWindow?.hide());
    } else {
      console.error('no How To Play window elements found');
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

  public setSize = (newValues: MinefieldValues) => {
    this.gameOptions = { ...this.gameOptions, ...newValues };
    this.startNewGame();
  };
}
