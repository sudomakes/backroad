import { BackroadComponent } from '../../base';

export class MarkdownComponent extends BackroadComponent<{
  body: string | number;
}> {
  constructor(props: { key: string; body: MarkdownComponent['args']['body'] }) {
    super('', 'markdown', { body: props.body });
    this.args = { body: props.body };
  }
}
