import { BackroadComponent, InbuiltComponentTypes } from 'backroad-core';

export type BackroadComponentRenderer<
  ComponentType extends InbuiltComponentTypes
> = (props: BackroadComponent<ComponentType, true>) => JSX.Element;
