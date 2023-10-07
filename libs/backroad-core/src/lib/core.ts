import type { TypedChartComponent } from 'react-chartjs-2/dist/types';
import type { Props } from 'react-select';

export type SelectOptionType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  label: string;
};
type SelectValueType = SelectOptionType['value'];
type _ComponentBasePropsMapping = {
  number_input: {
    args: {
      label: string;
      min?: number;
      max?: number;
      step?: number;
      precision?: number;
    };
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
  line_chart: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    args: Parameters<TypedChartComponent<'line'>>[0];
    value: null;
  };
  select: {
    readonly args: {
      // options: any[];
      label?: string;
      // formatOption?: (option: any) => string;
    } & Omit<Props<SelectOptionType, false>, 'onChange' | 'isMulti'>;
    value: SelectValueType | null;
  };
  multiselect: {
    args: {
      // options: any[];
      label?: string;
      // formatOption?: (option: any) => string;
    } & Omit<Props<SelectOptionType, true>, 'onChange'>;
    value: any[];
  };
  image: {
    args: { src: string };
    value: null;
  };
  link: {
    args: { label: string; href: string; target?: string };
    value: null;
  };
  link_group: {
    args: {
      items: {
        label?: string;
        href: string;
        target?: string;
      }[];
    };
    value: null;
  };
  stats: {
    args: {
      items: {
        label: string;
        value: string | number;
        delta?: string | number;
      }[];
    };
    value: null;
  };
  json: {
    args: {
      src: object;
    };
    value: null;
  };
  title: {
    args: {
      label: string;
    };
    value: null;
  };
  // chart:{
  //   args: {
  //     data: any;
  //     options: any;
  //   };
  //   value: null;
  // };
};
export type ComponentPropsMapping = {
  [key in keyof _ComponentBasePropsMapping]: {
    args: _ComponentBasePropsMapping[key]['args'];
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
  sidebar: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    args: {};
  };
  page: {
    args: { path: string };
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

export type BackroadComponent<
  Type extends InbuiltComponentTypes,
  ValuePopulated extends boolean = false
> = {
  args: //  Type extends InbuiltComponentTypes?
  ComponentPropsMapping[Type]['args'];
  type: Type;
  path: string;
  id: string;
} & (ValuePopulated extends true
  ? {
      value: ComponentPropsMapping[Type]['value'];
    }
  : // eslint-disable-next-line @typescript-eslint/ban-types
    {});
export interface BackroadContainer<
  Type extends InbuiltContainerTypes,
  ChildrenValuePopulated extends boolean = false
> {
  children: BackroadNode<false, ChildrenValuePopulated>[];
  args: Type extends InbuiltContainerTypes
    ? ContainerArgsMapping[Type]['args']
    : object;
  type: Type;
  path: string;
}

export type GenericBackroadComponent<ValuePopulated extends boolean = false> =
  BackroadComponent<InbuiltComponentTypes, ValuePopulated>;
// &
//   (ValuePopulated extends true
//     ? { value: unknown }
//     : // eslint-disable-next-line @typescript-eslint/ban-types
//       {});
export type GenericBackroadContainer<
  ChildrenValuePopulated extends boolean = false
> = BackroadContainer<InbuiltContainerTypes, ChildrenValuePopulated>;
export type BackroadNode<
  ValuePopulated extends boolean = false,
  ChildrenValuePopulated extends boolean = false
> =
  | GenericBackroadComponent<ValuePopulated>
  | GenericBackroadContainer<ChildrenValuePopulated>;
// Type extends InbuiltComponentTypes
//   ? BackroadComponent<Type>
//   : Type extends InbuiltContainerTypes
//   ? BackroadContainer<Type>
//   : {
//       path: string;
//       type: string;
//       id?: string;
//     };

export function isBackroadComponent<ValuePopulated extends boolean>(
  element: BackroadNode,
  valuePopulated: ValuePopulated
): element is GenericBackroadComponent<ValuePopulated> {
  return (
    !('children' in element) &&
    (valuePopulated ? 'value' in element : !('value' in element))
  );
}
