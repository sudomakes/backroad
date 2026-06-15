import { BackroadContainerRenderer } from '../types/containers';
import { Frame } from './frame';

export const Base: BackroadContainerRenderer<'base'> = (props) => {
  // Same body/dock split as the page, but `h-full` so it inherits a bounded
  // height from whatever frame encloses it (a sized tab/column cell), and
  // degrades to plain flow when there's no dock.
  return (
    <Frame nodes={props.children}>
      {({ body, dock, hasDock }) => (
        <div
          className={
            hasDock
              ? 'container mx-auto flex h-full min-h-0 flex-col'
              : 'container mx-auto flex flex-col gap-3 lg:gap-5'
          }
        >
          <div
            className={
              hasDock
                ? 'flex min-h-0 flex-1 flex-col gap-3 lg:gap-5 overflow-y-auto'
                : 'contents'
            }
          >
            {body}
          </div>
          {hasDock ? (
            <div className="flex shrink-0 flex-col">{dock}</div>
          ) : null}
        </div>
      )}
    </Frame>
  );
};
