import Cell from './Cell';

export type MinefieldInitialiserObject = {
  parent: HTMLElement;
  width: number;
  height: number;
  numberOfMines?: number;
};

export default class Minefield {
  children: Cell[][] = [];
  remainingCells: number;
  parent: HTMLElement;
  timerDiv: HTMLElement;
  minesRemainingDiv: HTMLElement;
  buttonElement: HTMLElement;
  timerIntervalId: number | null = null;

  constructor({ parent, width, height, numberOfMines = 20 }: MinefieldInitialiserObject) {
    this.remainingCells = width * height - numberOfMines;
    this.parent = parent;
    this.minesRemainingDiv = document.getElementById('mines-remaining')!;
    this.timerDiv = document.getElementById('time-elapsed')!;
    this.buttonElement = document.getElementById('new-game-button')!;

    for (let x = 0; x < width; x++) {
      const column: Cell[] = [];
      const columnDiv = document.createElement('div');
      columnDiv.classList.add('column');
      for (let y = 0; y < height; y++) {
        const cell = new Cell(x, y, this);
        const cellDiv = cell.getElement();
        column.push(cell);
        columnDiv.append(cellDiv);
      }
      this.children.push(column);
      parent.append(columnDiv);
    }
    this.generateMines(numberOfMines);
    this.generateValues();
    this.parent.addEventListener('click', this.startTimer, { once: true });
    this.parent.addEventListener('mousedown', this.mouseDownListener);
    this.parent.addEventListener('mouseup', this.mouseUpListener);
  }

  private mouseDownListener = (event: MouseEvent) => {
    if (event.button === 0) {
      this.buttonElement.style.setProperty('--image-position', 'top right');
    }
  };

  private mouseUpListener = () => {
    this.buttonElement.style.cssText = '';
  };

  public revealSurrounding(x: number, y: number) {
    const surroundingCells = this.getSurroundingCells(x, y);
    surroundingCells.forEach(cell => cell.click());
  }

  public explode(x: number, y: number) {
    console.log(x, y, 'exploded!');
    this.buttonElement.classList.add('game-lost');
    this.endGame({ win: false });
  }

  public increment() {
    this.remainingCells--;
    this.minesRemainingDiv.innerText = this.remainingCells.toString().padStart(3, '0');
    if (this.remainingCells === 0) {
      this.buttonElement.classList.add('game-won');
      this.endGame({ win: true });
    }
  }

  private getSurroundingCells(x: number, y: number) {
    const surroundingCells = [
      this.children[x - 1]?.[y - 1], // topLeft
      this.children[x]?.[y - 1], // topCenter
      this.children[x + 1]?.[y - 1], // topRight
      this.children[x - 1]?.[y], // centerLeft
      this.children[x + 1]?.[y], // centerRight
      this.children[x - 1]?.[y + 1], // bottomLeft
      this.children[x]?.[y + 1], // bottomCenter
      this.children[x + 1]?.[y + 1], // bottomRight
    ];
    return surroundingCells.filter(el => el);
  }

  private generateMines(numberOfMines: number) {
    for (let i = 0; i < numberOfMines; i++) {
      let mineAdded = false;
      while (!mineAdded) {
        const x = Math.floor(Math.random() * this.children.length);
        const y = Math.floor(Math.random() * this.children[0].length);
        if (this.children[x][y].containsBomb !== true) {
          this.children[x][y].containsBomb = true;
          mineAdded = true;
        }
      }
    }
  }

  private generateValues() {
    this.children.forEach((column, x) => {
      column.forEach((cell, y) => {
        const surroundingCells = this.getSurroundingCells(x, y);
        const value = surroundingCells.reduce(
          (total, currentCell) => (currentCell.containsBomb ? total + 1 : total),
          0,
        );
        cell.setValue(value);
      });
    });
  }

  private endGame({ win }: { win: boolean }) {
    this.forEachChild(cell => cell.endGame({ win }));
    requestAnimationFrame(() => {
      this.timerIntervalId && clearInterval(this.timerIntervalId);
    });
  }

  private forEachChild(fn: (cell: Cell) => void) {
    this.children.forEach(column => column.forEach(cell => fn(cell)));
  }

  public reset() {
    this.children = [];
    this.parent.innerHTML = '';
    this.buttonElement.style.cssText = '';
    this.buttonElement.className = '';
    this.timerIntervalId && clearInterval(this.timerIntervalId);
    this.timerDiv.innerText = '000';
    this.minesRemainingDiv.innerText = '000';
    this.parent.removeEventListener('click', this.startTimer);
    this.parent.removeEventListener('mousedown', this.mouseDownListener);
    this.parent.removeEventListener('mouseup', this.mouseUpListener);
  }

  private startTimer = () => {
    console.log('starting timer');

    if (this.timerDiv) {
      if (this.timerIntervalId) {
        this.timerDiv.innerText = '000';
        clearInterval(this.timerIntervalId);
      }
      this.timerIntervalId = setInterval(() => {
        const seconds = Number(this.timerDiv.innerText);
        this.timerDiv.innerText = (seconds + 1).toString().padStart(3, '0');
      }, 1000);
    }
  };
}
