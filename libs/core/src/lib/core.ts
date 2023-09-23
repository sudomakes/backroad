interface ArgsType {
  [key: string]: unknown;
}
interface BackroadNode<Args extends ArgsType = ArgsType> {
  path: string;
  args: Args;
  type: string;
}

export interface BackroadComponent<
  Args extends ArgsType = ArgsType,
  Value = unknown
> extends BackroadNode<Args> {
  value: Value;
  // path: string;
  // args: ArgsType;
}

export interface BackroadContainer<Args extends ArgsType = ArgsType>
  extends BackroadNode<Args> {
  // path: string;
  // args: ArgsType;
  children: (BackroadContainer | BackroadComponent)[];
}

export type BaseContainer = BackroadContainer;
export type ColumnsContainer = BackroadContainer<{
  columnCount: number;
}>;

export type ComponentPropMapping = {
  NumberInput: {
    args: { label: string };
    value: number;
  };
  Markdown: {
    args: { body: string };
  };
};
// export class BackroadComponent<
//   ArgsType extends Record<string, unknown> = Record<string, unknown>,
//   U = undefined
// > {
//   path: string;
//   key: string;
//   type: string;
//   args: ArgsType;
//   constructor(path: string, type: string, args: ArgsType) {
//     this.path = path;
//     this.type = type;
//     this.args = args;
//     sessionConnector.requestRender(this);
//   }
//   get value() {
//     return sessionConnector.getValueOf(this.path);
//   }
// }
