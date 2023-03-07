import Minefield from './Minefield';

const flagImg = '<img class="icon" src="images/flag.svg" />';
const bombImg = '<img class="icon" src="/images/bomb.png" />';

export default class Cell {
  x: number;
  y: number;
  value = 0;
  element: HTMLDivElement | null = null;
  containsBomb = false;
  clicked = false;
  flagged = false;
  frozen = false;
  parent: Minefield;

  public constructor(x: number, y: number, parent: Minefield) {
    this.x = x;
    this.y = y;
    this.parent = parent;
  }

  public setValue(value: number) {
    this.value = value;
  }

  public getElement() {
    this.element = document.createElement('div');
    this.element.classList.add('cell', 'hidden');
    this.element.addEventListener('mousedown', event => this.click(event));
    this.element.addEventListener('contextmenu', e => e.preventDefault());
    return this.element;
  }

  public revealCell() {
    this.clicked = true;
    this.parent.increment();
    if (this.element) {
      this.element.classList.remove('hidden');
      this.element.classList.add('revealed');
      this.element.dataset.value = this.value.toString();
      if (this.value > 0) this.element.innerText = this.value.toString();
    }
  }

  public click(event?: MouseEvent) {
    // if game is over, return immediately
    if (this.frozen) return;

    // middle click to reveal surrounding cells
    if (event?.button === 1) {
      if (this.clicked) {
        this.parent.revealSurrounding(this.x, this.y);
      }
      return;
    }
    //right click to flag
    if (!this.clicked && event?.button === 2) {
      event.preventDefault();
      this.toggleFlag();
      return;
    }

    // handle left click
    if (this.clicked || this.flagged) return;
    if (this.containsBomb) {
      this.explode();
      return;
    }
    this.revealCell();
    if (this.value === 0) this.parent.revealSurrounding(this.x, this.y);
  }

  public explode() {
    this.parent.explode(this.x, this.y);
    this.element!.classList.add('exploded');
    this.element!.innerHTML = bombImg;
  }

  private toggleFlag() {
    if (this.flagged) {
      this.flagged = false;
      this.element!.innerHTML = '';
    } else {
      this.flagged = true;
      this.element!.innerHTML = flagImg;
    }
  }

  public endGame({ win }: { win: boolean }) {
    this.frozen = true;
    if (this.containsBomb && !this.flagged && !this.clicked) {
      if (win) {
        this.element!.innerHTML = flagImg;
      } else {
        this.element!.innerHTML = bombImg;
      }
    }
  }
}
