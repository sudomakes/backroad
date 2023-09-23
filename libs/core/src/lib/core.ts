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
}

export interface BackroadContainer
  extends BackroadBaseNode<InbuiltContainerTypes> {
  children: (BackroadContainer | BackroadComponent)[];
}
export type BackroadNode = BackroadComponent | BackroadContainer;
