import { BackroadNode, isBackroadComponent } from '@backroad/core';
import { Suspense } from 'react';
import { backroadClientComponents } from './components';
import { backroadClientContainers } from './containers';

export const TreeRender = (props: { tree: BackroadNode }) => {
  if (isBackroadComponent(props.tree, true)) {
    const ComponentRenderer = backroadClientComponents[props.tree.type];
    // Suspense boundary for lazy renderers (e.g. `table`); inert for the rest.
    return (
      <Suspense fallback={null}>
        {/* @ts-expect-error there are sufficient checks to ensure this is correct */}
        <ComponentRenderer {...props.tree} key={props.tree.value} />
      </Suspense>
    );
  } else {
    // @ts-expect-error there are sufficient checks to ensure this is correct
    const ContainerRenderer = backroadClientContainers[props.tree.type];
    return <ContainerRenderer {...props.tree} />;
  }
};
