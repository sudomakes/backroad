import { BackroadComponent } from '../../base';

export class TextInput extends BackroadComponent<{
  label: string;
  defaultValue?: string;
  type?:"default"|"password"
}> {
  constructor(props: { key: string; body: TextInput['args']['body'] }) {
    super({ key: props.key, type: 'markdown' });
    this.args = { body: props.body };
  }
}
