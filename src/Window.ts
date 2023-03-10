export type WindowInitialiser = {
  element: HTMLElement;
  top?: number;
  left?: number;
};

export default class Window {
  windowElement: HTMLElement;
  defaultX: number;
  defaultY: number;
  x: number;
  y: number;

  constructor({ element, top = 0, left = 0 }: WindowInitialiser) {
    const titleBar = element.querySelector<HTMLDivElement>('.window-title-bar');
    const closeButton = element.querySelector<HTMLButtonElement>('.close-button');

    if (!element || !titleBar || !closeButton) {
      throw new Error('missing elements in Window element, check your html');
    }

    if (top) element.style.top = `${top}px`;
    if (left) element.style.left = `${left}px`;

    // assign variables
    this.windowElement = element;
    this.x = this.defaultX = top;
    this.y = this.defaultY = left;

    // add close button listener
    closeButton.addEventListener('click', () => this.hide());

    // add drag to move logic
    titleBar.addEventListener('mousedown', event => {
      const startX = event.clientX;
      const startY = event.clientY;
      const handleMouseMove = (event: MouseEvent) => {
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        this.windowElement.style.left = `${this.x + deltaX}px`;
        this.windowElement.style.top = `${this.y + deltaY}px`;
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener(
        'mouseup',
        event => {
          const deltaX = event.clientX - startX;
          const deltaY = event.clientY - startY;
          const newX = this.x + deltaX;
          const newY = this.y + deltaY;
          this.windowElement.style.left = `${newX}px`;
          this.windowElement.style.top = `${newY}px`;
          this.x = newX;
          this.y = newY;
          document.removeEventListener('mousemove', handleMouseMove);
        },
        {
          once: true,
        },
      );
    });
  }

  public show() {
    this.windowElement.classList.remove('window-hidden');
  }

  public hide() {
    this.windowElement.classList.add('window-hidden');
    this.x = this.defaultX;
    this.y = this.defaultY;
  }
}
