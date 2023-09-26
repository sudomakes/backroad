// import { BaseContainer } from "./containers/base-container"
import {
  BackroadComponent,
  BackroadContainer,
  ComponentPropsMapping,
  InbuiltComponentTypes,
  InbuiltContainerTypes,
} from 'backroad-core';
import { sessionConnector } from './session_connector';
import { omit } from 'lodash';
type BackroadComponentFormat<ComponentType extends InbuiltComponentTypes> = {
  key?: string;
  // type: ComponentType;
} & BackroadComponent<ComponentType>['args'];

/**
 * Manages the addition of nodes to the tree and also returns vaulues where applicable
 */
class BackroadNodeManager<ContainerType extends InbuiltContainerTypes> {
  constructor(private container: BackroadContainer<ContainerType>) {}
  private constructComponentObject<T extends InbuiltComponentTypes>(
    props: BackroadComponentFormat<T>,
    type: T
  ) {
    const nodePath = this.getDescendantKey();
    const componentNode = {
      key: props.key || nodePath,
      path: nodePath,
      args: omit(props, [
        'key',
        'type',
      ]) as unknown as ComponentPropsMapping[T]['args'],
      type: type,
    };

    return componentNode;
  }

  async addComponentDescendant<ComponentType extends InbuiltComponentTypes>(
    nodeData: BackroadComponent<ComponentType>
  ) {
    console.debug('Adding component', nodeData);
    this.container.children.push(nodeData);
    await sessionConnector.setValueIfNotExists({
      key: nodeData.key,
      value: nodeData.args.defaultValue,
    });
    await sessionConnector.requestRender(nodeData);
    return sessionConnector.getValueOf(nodeData);
  }
  async addContainerDescendant<ContainerType extends InbuiltContainerTypes>(
    containerNodeData: Omit<
      BackroadContainer<ContainerType>,
      'path' | 'children'
    > & {
      children?: BackroadContainer<ContainerType>['children'];
    }
  ) {
    const containerNode = {
      ...containerNodeData,
      path: this.getDescendantKey(),
      // allowing to pass children in case someone wants to make
      // columnsContainer and stuff (manual child creation)
      children: containerNodeData.children || [],
    };
    this.container.children.push(containerNode);
    await sessionConnector.requestRender(containerNode);
    return new BackroadNodeManager(
      containerNode as BackroadContainer<ContainerType>
    );
  }
  getDescendantKey() {
    return `${this.container.path ? this.container.path + '.' : ''}children.${
      this.container.children.length
    }`;
  }

  button(props: BackroadComponentFormat<'button'>) {
    return this.addComponentDescendant(
      this.constructComponentObject(props, 'button')
    );
  }
  numberInput(props: BackroadComponentFormat<'number_input'>) {
    return this.addComponentDescendant(
      this.constructComponentObject(props, 'number_input')
    );
  }
  write(props: BackroadComponentFormat<'markdown'>) {
    return this.addComponentDescendant(
      this.constructComponentObject(props, 'markdown')
    );
  }
}
export const br = new BackroadNodeManager({
  children: [],
  path: '',
  type: 'base',
  args: {},
});
