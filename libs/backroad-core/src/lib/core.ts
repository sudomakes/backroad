// Import the typed chart components from the package root rather than the
// deep `react-chartjs-2/dist/types` path, which isn't in the package's
// `exports` map and fails to resolve under `bundler`/`node16` moduleResolution
// (e.g. the Storybook tsconfig). Each component IS a TypedChartComponent<T>,
// so `Parameters<typeof X>[0]` yields the identical props type.
import type { Line, Bar, Pie, Doughnut, Radar, Scatter } from 'react-chartjs-2';
import type { Props } from 'react-select';
import type { ColumnHelper } from '@tanstack/react-table';
import { HTMLProps, IframeHTMLAttributes } from 'react';
import formidable from 'formidable';
import type { DropzoneOptions } from 'react-dropzone';
import type { ToastArgs } from './events';
// import { v4 as uuidv4 } from 'uuid';
// type FileUploadObject = {
//   id: string;
//   // constructor() {
//   //   this.id = '';
//   //   // this.id = uuidv4();
//   // }
// };

export type SelectOptionType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  label: string;
};
type SelectValueType = SelectOptionType['value'];
type AllowDefaultHelper<T> = T extends {
  args: infer ArgsType;
  value: infer ValueType;
}
  ? { args: ArgsType & { defaultValue?: ValueType }; value: ValueType }
  : never;
type _ComponentBasePropsMapping = {
  number_input: AllowDefaultHelper<{
    args: {
      label: string;
      min?: number;
      max?: number;
      step?: number;
      precision?: number;
    };
    value: number;
  }>;
  markdown: {
    // `streaming` is set only by the streaming primitives (streamable /
    // writeStream). The renderer reads it to re-render in place instead of
    // remounting on every body change — see libs/backroad-components markdown.
    args: { body: string | number; streaming?: boolean };
    value: null;
  };
  button: {
    args: {
      label: string;
    };
    value: boolean;
  };
  download_button: {
    // Only the label rides along in the tree on every rerun. The payload
    // (data/filename/mime) is held server-side and streamed on demand from
    // GET /api/download/:sessionId/:id when the button is actually clicked —
    // see the `downloadButton` builder and the server route.
    args: {
      label: string;
    };
    // true on the run where the button was clicked, then unset.
    value: boolean;
  };

  select: AllowDefaultHelper<{
    readonly args: {
      // options: any[];
      label?: string;
      // formatOption?: (option: any) => string;
    } & Omit<
      Props<SelectOptionType, false>,
      'onChange' | 'isMulti' | 'defaultValue'
    >;

    value: SelectValueType;
  }>;
  multiselect: {
    args: {
      // options: any[];
      label?: string;
      // formatOption?: (option: any) => string;
    } & Omit<Props<SelectOptionType, true>, 'onChange'>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any[];
  };
  image: {
    args: HTMLProps<HTMLImageElement>;
    value: null;
  };
  iframe: {
    args: { title: string } & Omit<
      IframeHTMLAttributes<HTMLIFrameElement>,
      'title'
    >;
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
  table: {
    args: {
      columns: Record<string, Parameters<ColumnHelper<any>['accessor']>[1]>;
      data: object[];
    };
    value: null;
  };
  line_chart: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    args: Parameters<typeof Line>[0];
    value: null;
  };
  bar_chart: {
    args: Parameters<typeof Bar>[0];
    value: null;
  };
  pie_chart: {
    args: Parameters<typeof Pie>[0];
    value: null;
  };
  doughnut_chart: {
    args: Parameters<typeof Doughnut>[0];
    value: null;
  };
  radar_chart: {
    args: Parameters<typeof Radar>[0];
    value: null;
  };
  scatter_chart: {
    args: Parameters<typeof Scatter>[0];
    value: null;
  };

  chat_input: {
    args: { placeholder?: string };
    value: string | null;
  };
  color_picker: AllowDefaultHelper<{
    args: { label?: string };
    value: string;
  }>;
  checkbox: AllowDefaultHelper<{
    args: {
      label: string;
    };
    value: boolean;
  }>;
  toggle: AllowDefaultHelper<{
    args: {
      label: string;
    };
    value: boolean;
  }>;
  radio: AllowDefaultHelper<{
    args: {
      options: string[];
      label: string;
    };
    value: string;
  }>;
  text_input: AllowDefaultHelper<{
    args: {
      label: string;
      placeholder?: string;
    };
    value: string;
  }>;
  text_area: AllowDefaultHelper<{
    args: {
      label: string;
      placeholder?: string;
      rows?: number;
    };
    value: string;
  }>;
  slider: AllowDefaultHelper<{
    args: {
      label: string;
      min?: number;
      max?: number;
      step?: number;
    };
    value: number;
  }>;
  // ISO date string (`YYYY-MM-DD`); empty string means no date selected.
  date_input: AllowDefaultHelper<{
    args: {
      label: string;
      min?: string;
      max?: string;
    };
    value: string;
  }>;
  // 24-hour time string (`HH:mm`); empty string means no time selected.
  time_input: AllowDefaultHelper<{
    args: {
      label: string;
      step?: number;
    };
    value: string;
  }>;
  file_upload: {
    args: {
      label: string;
    } & Omit<DropzoneOptions, 'onUpload'>;
    value: formidable.File[];
  };
  video: {
    args: HTMLProps<HTMLVideoElement>;
    value: null;
  };
  loading_spinner: {
    args: {
      fontSize: number;
      top?: number;
      left?: number;
      variant?: 'dots' | 'bars';
    };
    value: null;
  };
  // Transient notification. Renders nothing in the page flow — on mount the
  // renderer fires a sonner toast (a side effect) and unmounts on the next run.
  // Works because the render queue flushes each run on its own microtask, so a
  // button's set→unset reruns reach the client as separate commits (the node
  // gets one real mount before the unset removes it). No value (display-only).
  toast: {
    args: ToastArgs;
    value: null;
  };
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
    args: { columns: number | number[] };
  };
  sidebar: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    args: {};
  };
  bottom: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    args: {};
  };
  page: {
    args: { path: string };
  };
  collapse: {
    args: {
      label: string;
    };
  };
  tabs: {
    args: {
      labels: string[];
    };
  };
  chat_message: {
    args: {
      by: string;
      avatar?: string;
      avatarPlacement?: 'left' | 'right';
      loadingPromise?: Promise<string>;
    };
  };
};
export type ManagerArgsMapping = {
  chat_manager: {
    args: {
      messages: (ContainerArgsMapping['chat_message']['args'] & {
        content: string | Promise<string>;
      })[];
    };
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

// if no default is provided, null will be supplied (by default) by setter
export const defaultValueFallbacks: {
  [key in InbuiltComponentTypes]?:
    | ComponentPropsMapping[key]['value']
    | ((props: {
        args: ComponentPropsMapping[key]['args'];
      }) => ComponentPropsMapping[key]['value']);
} = {
  chat_input: null,
  button: false,
  download_button: false,
  color_picker: '#000000',
  checkbox: false,
  toggle: false,
  radio: (props) => props.args.options[0],
  text_input: '',
  text_area: '',
  // Seed the slider at its min (or 0) so the thumb starts at the low end.
  slider: (props) => props.args.min ?? 0,
  date_input: '',
  time_input: '',
  file_upload: [],
};
