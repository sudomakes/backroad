import { ContainerPropsMapping, InbuiltContainerTypes } from 'backroad-core';
import { Base } from './base';

export const backroadClientContainers: {
  [key in InbuiltContainerTypes]: (
    props: ContainerPropsMapping[key]
  ) => JSX.Element;
} = {
  base: Base,
  columns: (props: ContainerPropsMapping['columns']) => <div>Columns</div>,
};
