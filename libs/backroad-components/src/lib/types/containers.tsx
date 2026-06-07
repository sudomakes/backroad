import { BackroadContainer, InbuiltContainerTypes } from '@backroad/core';

export type BackroadContainerRenderer<
  ContainerType extends InbuiltContainerTypes
> = (props: BackroadContainer<ContainerType, true>) => JSX.Element;
