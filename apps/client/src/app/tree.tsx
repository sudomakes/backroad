import {
  BackroadComponent,
  // BackroadContainer,
  BackroadNode,
  ComponentPropsMapping,
  InbuiltComponentTypes,
  isBackroadComponent,
} from 'backroad-core';
import { backroadClientComponents } from './components';
import { backroadClientContainers } from './containers';

export const TreeRender = (props: {
  tree:
    | BackroadComponent<InbuiltComponentTypes>
    | (BackroadComponent<InbuiltComponentTypes> & {
        value: ComponentPropsMapping[InbuiltComponentTypes]['value'];
      });
}) => {
  if (isBackroadComponent(props.tree)) {
    const ComponentRenderer = backroadClientComponents[props.tree.type];
    return (
      // @ts-expect-error there are sufficient checks to ensure this is correct
      <ComponentRenderer
        // key={props.tree.id}
        {...{
          args: props.tree.args,
          value: props.tree.value,
          id: props.tree.id,
        }}
      />
    );
  } else {
    // @ts-expect-error there are sufficient checks to ensure this is correct
    const ContainerRenderer = backroadClientContainers[props.tree.type];
    return <ContainerRenderer {...props.tree} />;
  }
};
