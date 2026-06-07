import { BackroadComponent, InbuiltComponentTypes } from '@backroad/core';

export type BackroadComponentRenderer<
  ComponentType extends InbuiltComponentTypes
> = (
  props: Omit<BackroadComponent<ComponentType, true>, 'args'> & {
    args: Omit<BackroadComponent<ComponentType, true>['args'], 'defaultValue'>;
  }
) => JSX.Element;
