import {
  BackroadComponent,
  BackroadContainer,
  BackroadNode,
} from '@backroad/core';
import { backroadClientComponents } from './components';
import { backroadClientContainers } from './containers';

function isComponentLeaf(element: BackroadNode): element is BackroadComponent {
  return !('children' in element);
}
export const TreeRender = (props: {
  tree: BackroadContainer | BackroadComponent;
}) => {
  if (isComponentLeaf(props.tree)) {
    const ComponentRenderer = backroadClientComponents[props.tree.type];
    return (
      // @ts-expect-error there are sufficient checks to ensure this is correct
      <ComponentRenderer
        {...{ args: props.tree.args, value: props.tree.value }}
      />
    );
  } else {
    const ContainerRenderer = backroadClientContainers[props.tree.type];
    // @ts-expect-error there are sufficient checks to ensure this is correct
    return <ContainerRenderer {...props.tree} />;
  }
};
