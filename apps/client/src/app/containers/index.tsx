import { BackroadContainer, InbuiltContainerTypes } from 'backroad-core';
import { Base } from './base';

export const backroadClientContainers: {
  [key in InbuiltContainerTypes]: (
    props: BackroadContainer<key, true>
  ) => JSX.Element;
} = {
  base: Base,
  columns: (props) => <div>Columns</div>,
};
