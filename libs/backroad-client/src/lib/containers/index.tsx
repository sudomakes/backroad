import { InbuiltContainerTypes } from 'backroad-core';
import { BackroadContainerRenderer } from '../types/containers';
import { Base } from './base';
import { Sidebar } from './sidebar';
import { _Page } from './page';
import { Columns } from './columns';

export const backroadClientContainers: {
  [key in InbuiltContainerTypes]: BackroadContainerRenderer<key>;
} = {
  base: Base,
  columns: Columns,
  sidebar: Sidebar,
  page: _Page,
};
