import { BackroadNode, isBackroadComponent } from 'backroad-core';
import { backroadClientComponents } from './components';
import { backroadClientContainers } from './containers';

export const TreeRender = (props: { tree: BackroadNode }) => {
  if (isBackroadComponent(props.tree, true)) {
    const ComponentRenderer = backroadClientComponents[props.tree.type];
    console.log(
      'trying to render component',
      props.tree,
      'using',
      ComponentRenderer
    );
    // @ts-expect-error there are sufficient checks to ensure this is correct
    return <ComponentRenderer {...props.tree} />;
  } else {
    // @ts-expect-error there are sufficient checks to ensure this is correct
    const ContainerRenderer = backroadClientContainers[props.tree.type];
    console.log(
      'trying to render container',
      props.tree,
      'using',
      ContainerRenderer
    );
    return <ContainerRenderer {...props.tree} />;
  }
};
