// import { BaseContainer } from "./containers/base-container"
import {
  BackroadComponent,
  BackroadContainer,
  ComponentPropsMapping,
  ContainerPropsMapping,
  GenericBackroadComponent,
  InbuiltComponentTypes,
  InbuiltContainerTypes,
} from 'backroad-core';
import { sessionConnector } from './session_connector';
import { omit } from 'lodash';
type BackroadComponentFormat<ComponentType extends InbuiltComponentTypes> = {
  id?: BackroadComponent<ComponentType, false>['id'];
} & BackroadComponent<ComponentType, false>['args'];

type BackroadContainerFormat<ContainerType extends InbuiltContainerTypes> =
  BackroadContainer<ContainerType, false>['args'];
/**
 * Manages the addition of nodes to the tree and also returns vaulues where applicable
 */

export class BackroadNodeManager<
  ContainerType extends InbuiltContainerTypes = 'page'
> {
  constructor(private container: BackroadContainer<ContainerType, false>) {}
  private constructComponentObject<T extends InbuiltComponentTypes>(
    props: BackroadComponentFormat<T>,
    type: T
  ) {
    const nodePath = this.getDescendantKey();
    const componentNode = {
      id: props.id || nodePath,
      path: nodePath,
      args: omit(props, [
        'id',
        'type',
      ]) as unknown as ComponentPropsMapping[T]['args'],
      type: type,
    };

    return componentNode;
  }
  private constructContainerObject<T extends InbuiltContainerTypes>(
    props: BackroadContainerFormat<T>,
    type: T
  ) {
    const nodePath = this.getDescendantKey();
    const containerNode = {
      path: nodePath,
      args: props as unknown as ContainerPropsMapping[T]['args'],
      type: type,
    };

    return containerNode;
  }

  async addComponentDescendant<ComponentType extends InbuiltComponentTypes>(
    nodeData: BackroadComponent<ComponentType, false>
  ) {
    console.debug('Adding component descendent', nodeData);
    this.container.children.push(nodeData as GenericBackroadComponent);
    const defaultSetResult = await sessionConnector.setValueIfNotExists({
      id: nodeData.id,
      value: nodeData.args.defaultValue,
    });
    console.log(
      'set default value call done for component descendent',
      nodeData.id,
      'proceeding to requesting render, (setting was',
      defaultSetResult ? 'successful' : 'unsuccessful',
      ')'
    );
    await sessionConnector.requestRender(nodeData as GenericBackroadComponent);
    return sessionConnector.getValueOf(nodeData);
  }
  async addContainerDescendant<ContainerType extends InbuiltContainerTypes>(
    containerNodeData: Omit<
      BackroadContainer<ContainerType>,
      'path' | 'children'
    > & {
      children?: BackroadContainer<ContainerType, false>['children'];
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
  line(props: BackroadComponentFormat<'line_chart'>) {
    return this.addComponentDescendant(
      this.constructComponentObject(props, 'line_chart')
    );
  }
  select(props: BackroadComponentFormat<'select'>) {
    return this.addComponentDescendant(
      this.constructComponentObject(props, 'select')
    );
  }
  image(props: BackroadComponentFormat<'image'>) {
    return this.addComponentDescendant(
      this.constructComponentObject(props, 'image')
    );
  }
  sidebar(props: BackroadContainerFormat<'sidebar'>) {
    return this.addContainerDescendant(
      this.constructContainerObject(props, 'sidebar')
    );
  }
  link(props: BackroadComponentFormat<'link'>) {
    return this.addComponentDescendant(
      this.constructComponentObject(props, 'link')
    );
  }
  page(props: BackroadContainerFormat<'page'>) {
    return rootNodeManager.addContainerDescendant(
      this.constructContainerObject(props, 'page')
    );
    // return this.addContainerDescendant(
    //   this.constructContainerObject(props, 'page')
    // );
  }
  linkGroup(props: BackroadComponentFormat<'link_group'>) {
    return this.addComponentDescendant(
      this.constructComponentObject(props, 'link_group')
    );
  }
}

const mainPageContainer: BackroadContainer<'page', false> = {
  type: 'page',
  args: {
    path: '/',
  },
  children: [],
  path: 'children.0',
};
const rootNodeManager = new BackroadNodeManager({
  children: [mainPageContainer],
  path: '',
  type: 'base',
  args: {},
});

// const mainPageManager = rootNodeManager.addContainerDescendant();

export const br = new BackroadNodeManager(mainPageContainer);
