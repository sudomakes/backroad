import { BackroadComponent, InbuiltComponentTypes } from '@backroad/core';
import { BarChart } from './bar_chart';
import { Button } from './button';
import { ChatInput } from './chat_input';
import { DoughnutChart } from './doughnut_chart';
import { Image } from './image';
import { Json } from './json';
import { LineChart } from './line_chart';
import { Link } from './link';
import { LinkGroup } from './link_group';
import { Markdown } from './markdown';
import { Multiselect } from './multiselect';
import { NumberInput } from './number_input';
import { PieChart } from './pie_chart';
import { RadarChart } from './radar_chart';
import { ScatterChart } from './scatter_chart';
import { Select } from './select';
import { Stats } from './stats';
import { Table } from './table';
import { Title } from './title';
import { ColorPicker } from './color_picker';
import { Toggle } from './toggle';
import { Checkbox } from './checkbox';
import { Radio } from './radio';
import { TextInput } from './text_input';
export const backroadClientComponents: {
  [key in InbuiltComponentTypes]: (
    props: BackroadComponent<key, true>
  ) => JSX.Element;
} = {
  number_input: NumberInput,
  markdown: Markdown,
  button: Button,
  line_chart: LineChart,
  select: Select,
  image: Image,
  link: Link,
  link_group: LinkGroup,
  stats: Stats,
  multiselect: Multiselect,
  json: Json,
  title: Title,
  table: Table,
  bar_chart: BarChart,
  pie_chart: PieChart,
  doughnut_chart: DoughnutChart,
  radar_chart: RadarChart,
  scatter_chart: ScatterChart,
  chat_input: ChatInput,
  color_picker: ColorPicker,
  toggle: Toggle,
  checkbox: Checkbox,
  radio: Radio,
  text_input: TextInput
};
