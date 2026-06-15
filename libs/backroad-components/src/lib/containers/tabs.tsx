import { BackroadContainerRenderer } from '../types/containers';
import { TreeRender } from '../tree';
import { Tabs as UITabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export const Tabs: BackroadContainerRenderer<'tabs'> = (props) => {
  return (
    <UITabs defaultValue="0" className="w-full">
      <TabsList>
        {props.args.labels.map((label, idx) => (
          <TabsTrigger key={label} value={String(idx)}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {props.children.map((child, idx) => (
        <TabsContent value={String(idx)} key={child.path} className="mt-4">
          <TreeRender tree={child} />
        </TabsContent>
      ))}
    </UITabs>
  );
};
