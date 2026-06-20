import { sessionId, setRunUnsetBackroadValue, withBasePath } from '../socket';
import { BackroadComponentRenderer } from '../types/components';
import { Button as UIButton } from 'backroad-ui';

export const DownloadButton: BackroadComponentRenderer<'download_button'> = (
  props
) => {
  const { label } = props.args;
  return (
    <UIButton
      onClick={() => {
        // The payload isn't in the tree — fetch it on demand from the server,
        // which streams it back with an attachment disposition (filename + mime
        // are set server-side). A transient anchor triggers the save dialog
        // without navigating the page away.
        const anchor = document.createElement('a');
        anchor.href = withBasePath(
          `/api/download/${sessionId}/${encodeURIComponent(props.id)}`
        );
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setRunUnsetBackroadValue({ id: props.id, value: true });
      }}
    >
      {label}
    </UIButton>
  );
};
