import { InbuiltContainerTypes } from 'backroad-core';
import { BackroadContainerRenderer } from '../types/containers';
import { Base } from './base';
import { Sidebar } from './sidebar';
import { _Page } from './page';

export const backroadClientContainers: {
  [key in InbuiltContainerTypes]: BackroadContainerRenderer<key>;
} = {
  base: Base,
  columns: (props) => <div>Columns</div>,
  sidebar: Sidebar,
  page: _Page,
};
