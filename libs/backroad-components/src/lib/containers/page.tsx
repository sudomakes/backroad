import { BackroadContainerRenderer } from '../types/containers';
import { Frame } from './frame';

export const Page: BackroadContainerRenderer<'page'> = (props) => {
  // A `bottom` child turns the page into a frame: a viewport-height column whose
  // message body scrolls internally while the dock (chat input) stays pinned at
  // the bottom. Without one, keep the original window-scrolled flow so ordinary
  // pages are unaffected. One skeleton across both cases (body is
  // `display: contents` when not docking) keeps children from remounting on the
  // toggle.
  return (
    <Frame nodes={props.children}>
      {({ body, dock, hasDock }) => (
        <div
          className={
            hasDock
              ? 'container mx-auto flex h-[100dvh] flex-col max-w-[900px]'
              : 'container mx-auto flex flex-1 flex-col gap-3 lg:gap-5 px-3 py-[100px] lg:px-5 max-w-[900px]'
          }
        >
          <div
            className={
              hasDock
                ? 'flex min-h-0 flex-1 flex-col gap-3 lg:gap-5 overflow-y-auto px-3 pt-[100px] pb-4 lg:px-5'
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
