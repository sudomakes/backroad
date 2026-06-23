import { BackroadNode, isBackroadComponent } from '@backroad/core';
import { Suspense } from 'react';
import { backroadClientComponents } from './components';
import { backroadClientContainers } from './containers';

export const TreeRender = (props: { tree: BackroadNode }) => {
  if (isBackroadComponent(props.tree, true)) {
    const ComponentRenderer = backroadClientComponents[props.tree.type];
    // Suspense boundary for lazy renderers (e.g. `table`); inert for the rest.
    // Key by the component's stable `id`, NOT its value: the parent already
    // keys this whole subtree by `path`, so keying on value here only served to
    // force a remount whenever the value changed — which dropped focus, the text
    // caret, and selection mid-edit on every rerun. Value-driven UI updates are
    // handled inside the components via `useSyncedState` instead, so the DOM
    // node now survives a value change and only remounts when the component's
    // identity actually changes.
    return (
      <Suspense fallback={null}>
        {/* @ts-expect-error there are sufficient checks to ensure this is correct */}
        <ComponentRenderer {...props.tree} key={props.tree.id} />
      </Suspense>
    );
  } else {
    // @ts-expect-error there are sufficient checks to ensure this is correct
    const ContainerRenderer = backroadClientContainers[props.tree.type];
    return <ContainerRenderer {...props.tree} />;
  }
};
