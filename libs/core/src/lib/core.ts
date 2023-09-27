type _ComponentBasePropsMapping = {
  number_input: {
    args: { label: string };
    value: number;
  };
  markdown: {
    args: { body: string | number };
    value: null;
  };
  button: {
    args: {
      label: string;
    };
    value: boolean;
  };
};
export type ComponentPropsMapping = {
  [key in keyof _ComponentBasePropsMapping]: {
    args: _ComponentBasePropsMapping[key]['args'] & {
      defaultValue?: _ComponentBasePropsMapping[key]['value'];
    };
    value: _ComponentBasePropsMapping[key]['value'];
    id: string;
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
    children: BackroadContainer<InbuiltContainerTypes>['children'];
  };
};

export type InbuiltNodeTypes = InbuiltComponentTypes | InbuiltContainerTypes;

// interface BackroadBaseNode<NodeType extends InbuiltNodeTypes> {
//   path: string;
//   args: NodeType extends InbuiltComponentTypes
//     ? ComponentPropsMapping[NodeType]['args']
//     : NodeType extends InbuiltContainerTypes
//     ? ContainerArgsMapping[NodeType]['args']
//     : never;
//   type: NodeType;
// }

export interface BackroadComponent<Type extends InbuiltComponentTypes> {
  args: //  Type extends InbuiltComponentTypes?
  ComponentPropsMapping[Type]['args'];
  // : object;
  type: Type;
  path: string;
  id: string;
}
export interface BackroadContainer<Type extends InbuiltContainerTypes> {
  children: {
    type: InbuiltNodeTypes;
    path: string;
    children?: BackroadContainer<Type>['children'];
    args?: any;
    id?: string;
  }[];
  args: Type extends InbuiltContainerTypes
    ? ContainerArgsMapping[Type]['args']
    : object;
  type: Type;
  path: string;
}
// export type BackroadNode<Type extends InbuiltNodeTypes | unknown = 'unknown'> =
//   Type extends InbuiltComponentTypes
//     ? BackroadComponent<Type>
//     : Type extends InbuiltContainerTypes
//     ? BackroadContainer<Type>
//     : object;

export type BackroadNode<Type extends InbuiltNodeTypes | unknown = 'unknown'> =
  Type extends InbuiltComponentTypes
    ? BackroadComponent<Type>
    : Type extends InbuiltContainerTypes
    ? BackroadContainer<Type>
    : {
        path: string;
        type: string;
        id?: string;
      };

export function isBackroadComponent(
  element: BackroadNode
): element is BackroadComponent<InbuiltComponentTypes> & {
  value: ComponentPropsMapping[InbuiltComponentTypes]['value'];
} {
  return !('children' in element);
}
