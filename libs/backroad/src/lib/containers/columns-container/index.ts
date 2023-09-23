import { BackroadContainer } from '../../base';

export class ColumnsContainer extends BackroadContainer {
  constructor(props: { key: string; columnCount: number }) {
    super({ path: props.key });
  }
}
