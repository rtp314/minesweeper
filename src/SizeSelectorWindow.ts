import Window, { WindowInitialiser } from './Window';

type SizeSelectorInitialiser = WindowInitialiser & {
  setSize: SetSizeFunction;
};

type SetSizeFunction = (values: MinefieldValues) => void;

export type MinefieldValues = { width: number; height: number; mines: number };

export default class SizeSelectorWindow extends Window {
  setSize: SetSizeFunction;
  inputs: NodeListOf<HTMLInputElement>;

  constructor(props: SizeSelectorInitialiser) {
    super(props);
    this.setSize = props.setSize;

    const inputs = props.element.querySelectorAll<HTMLInputElement>('input');
    if (inputs.length !== 3) {
      throw new Error('missing inputs in SizeSelectorWindow');
    }
    this.inputs = inputs;

    const cancelButtons = props.element.querySelectorAll('.cancel-button');
    cancelButtons.forEach(button => button.addEventListener('click', () => this.hide()));

    const okButtons = props.element.querySelectorAll('.ok-button');
    okButtons.forEach(button =>
      button.addEventListener('click', () => {
        this.submit();
        this.hide();
      }),
    );
  }

  private submit() {
    const values: { [key: string]: string } = {};
    this.inputs.forEach(input => {
      values[input.name] = input.value;
    });
    this.setSize(values as any as MinefieldValues);
  }
}
