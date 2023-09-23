import { BackroadContainer } from '../../base';
import { MarkdownComponent } from '../../components/markdown';
import { ColumnsContainer } from '../columns-container';

export class BaseContainer extends BackroadContainer {
  constructor(props: { key: string }) {
    super({ path: props.key });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addDescendant<T extends { new (...args: Array<unknown>): any }>(
    ChildType: T,
    args: T extends { new (args: infer U, ...rest: Array<unknown>): unknown }
      ? Omit<U, 'key'> & { key?: string }
      : never
  ) {
    this.children.push(
      new ChildType({ key: this.getDescendantKey(), ...args })
    );
  }
  getDescendantKey() {
    return `${this.path}.${this.children.length}`;
  }
  write(body: MarkdownComponent['args']['body']) {
    this.addDescendant(MarkdownComponent, { body });
  }
  columns(columnCount: number) {
    this.addDescendant(ColumnsContainer, { columnCount });
    return;
  }

  numberInput(args: { label: string }) {
    return 5;
    // this.addDescendant(NumberInputComponent, args);
  }
  button(args: { label: string }) {
    // this.addDescendant(ButtonComponent, args);
  }
}
