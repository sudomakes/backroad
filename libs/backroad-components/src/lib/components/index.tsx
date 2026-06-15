import { BackroadComponent, InbuiltComponentTypes } from '@backroad/core';
import { lazy } from 'react';
import { Button } from './button';
import { ChatInput } from './chat_input';
import { Image } from './image';
import { Iframe } from './iframe';
import { Json } from './json';
import { Link } from './link';
import { LinkGroup } from './link_group';
import { Markdown } from './markdown';
import { Multiselect } from './multiselect';
import { NumberInput } from './number_input';
import { Select } from './select';
import { Stats } from './stats';
import { Table } from './table';
import { Title } from './title';
import { ColorPicker } from './color_picker';
import { Toggle } from './toggle';
import { Checkbox } from './checkbox';
import { Radio } from './radio';
import { FileUpload } from './file_upload';
import { TextInput } from './text_input';
import { TextArea } from './text_area';
import { Slider } from './slider';
import { DateInput } from './date_input';
import { TimeInput } from './time_input';
import { Toast } from './toast';
import { Video } from './video';
import { LoadingSpinner } from './loading_spinner';

// Charts are lazy-loaded so chart.js + react-chartjs-2 (the heaviest dependency
// in this lib) ship in their own chunk instead of the main bundle — they're
// only fetched once a chart actually renders. They all share one chunk because
// they import the same chart.js core. TreeRender wraps every renderer in a
// <Suspense> boundary, so the lazy load is transparent to callers.
const LineChart = lazy(() =>
  import('./line_chart').then((m) => ({ default: m.LineChart }))
);
const BarChart = lazy(() =>
  import('./bar_chart').then((m) => ({ default: m.BarChart }))
);
const PieChart = lazy(() =>
  import('./pie_chart').then((m) => ({ default: m.PieChart }))
);
const DoughnutChart = lazy(() =>
  import('./doughnut_chart').then((m) => ({ default: m.DoughnutChart }))
);
const RadarChart = lazy(() =>
  import('./radar_chart').then((m) => ({ default: m.RadarChart }))
);
const ScatterChart = lazy(() =>
  import('./scatter_chart').then((m) => ({ default: m.ScatterChart }))
);

export const backroadClientComponents: {
  [key in InbuiltComponentTypes]: (
    props: BackroadComponent<key, true>
  ) => JSX.Element;
} = {
  markdown: Markdown,

  link: Link,
  link_group: LinkGroup,

  stats: Stats,
  json: Json,
  table: Table,

  title: Title,

  line_chart: (props) => <LineChart {...props} />,
  bar_chart: (props) => <BarChart {...props} />,
  pie_chart: (props) => <PieChart {...props} />,
  doughnut_chart: (props) => <DoughnutChart {...props} />,
  radar_chart: (props) => <RadarChart {...props} />,
  scatter_chart: (props) => <ScatterChart {...props} />,

  chat_input: ChatInput,

  color_picker: ColorPicker,
  toggle: Toggle,
  checkbox: Checkbox,
  radio: Radio,
  file_upload: FileUpload,
  text_input: TextInput,
  text_area: TextArea,
  slider: Slider,
  date_input: DateInput,
  time_input: TimeInput,
  multiselect: Multiselect,
  select: Select,
  number_input: NumberInput,
  button: Button,

  image: Image,
  iframe: Iframe,
  video: Video,
  loading_spinner: LoadingSpinner,
  toast: Toast,
};
