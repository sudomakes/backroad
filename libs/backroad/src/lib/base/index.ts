export class BackroadContainer<T extends Record<string, unknown> = Record<string, unknown>> {
  key: string;
  args: T;
  children: (BackroadContainer | BackroadComponent)[] = [];
  constructor(props:{key: string}) {
    this.key = props.key;
  }
}

export class BackroadComponent<ArgsType extends Record <string, unknown> = Record<string, unknown>,U = undefined> {
  key: string;
  type: string;
  args: ArgsType;
  value?: U;
  constructor(props:{key: string, type: string}) {
    this.key = props.key;
    this.type = props.type;
  }
}
