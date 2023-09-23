export type ComponentPropsMapping = {
  number_input: {
    args: { label: string };
    value: number;
  };
  markdown: {
    args: { body: string };
  };
  button: {
    args: {
      label: string;
    };
    value: boolean;
  };
};

type ContainerArgsMapping = {
  base: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    args: {};
  };
  columns: {
    args: { columnCount: number };
  };
};
export type InbuiltComponentTypes = keyof ComponentPropsMapping;
export type InbuiltContainerTypes = keyof ContainerArgsMapping;
export type ContainerPropsMapping = {
  [key in InbuiltContainerTypes]: ContainerArgsMapping[key] & {
    children: BackroadNode[];
  };
};

export type InbuiltNodeTypes = InbuiltComponentTypes | InbuiltContainerTypes;
// interface ArgsType {
//   args: {
//     [key: string]: unknown;
//   };
// }
interface BackroadBaseNode<
  NodeType extends InbuiltNodeTypes
  // NodeProps extends ArgsType,
> {
  path: string;
  args: NodeType extends InbuiltComponentTypes
    ? ComponentPropsMapping[NodeType]['args']
    : NodeType extends InbuiltContainerTypes
    ? ContainerArgsMapping[NodeType]['args']
    : never;
  type: NodeType;
}

export interface BackroadComponent<Value = unknown>
  extends BackroadBaseNode<InbuiltComponentTypes> {
  value: Value;
  // path: string;
  // args: ArgsType;
}

export interface BackroadContainer
  extends BackroadBaseNode<InbuiltContainerTypes> {
  children: (BackroadContainer | BackroadComponent)[];
}

// export type BaseContainer = BackroadContainer;
// export type ColumnsContainer = BackroadContainer<{
//   columnCount: number;
// }>;

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
export type BackroadNode = BackroadComponent | BackroadContainer;
