import { sessionConnector } from '../session_connector';

export class BackroadContainer<
  T extends Record<string, unknown> = Record<string, unknown>
> {
  path: string;
  args: T;
  children: (BackroadContainer | BackroadComponent)[] = [];
  constructor(props: { path: string }) {
    this.path = props.path;
  }
}

export class BackroadComponent<
  ArgsType extends Record<string, unknown> = Record<string, unknown>,
  U = undefined
> {
  path: string;
  key: string;
  type: string;
  args: ArgsType;
  constructor(path: string, type: string, args: ArgsType) {
    this.path = path;
    this.type = type;
    this.args = args;
    sessionConnector.requestRender(this)
  }
  get value() {
    return sessionConnector.getValueOf(this.path);
  }
}
