import { InbuiltContainerTypes } from 'backroad-core';
import { BackroadContainerRenderer } from '../types/containers';
import { Base } from './base';
import { Menu } from './menu';

export const backroadClientContainers: {
  [key in InbuiltContainerTypes]: BackroadContainerRenderer<key>;
} = {
  base: Base,
  columns: (props) => <div>Columns</div>,
  menu: Menu,
};
