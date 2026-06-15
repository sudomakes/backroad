import { useEffect } from 'react';
import { BackroadComponentRenderer } from '../types/components';
import { showToast } from '../socket/show-toast';

// A toast renders nothing in the page flow — on mount it fires a sonner
// notification (into the app-root <Toaster>) and that's it. The render queue
// flushes each run on its own microtask, so even a button-triggered toast
// (present only on the set→unset run pair) gets one real mount here, which is
// all the side effect needs. Fires once on mount; a stable node won't re-fire.
export const Toast: BackroadComponentRenderer<'toast'> = (props) => {
  useEffect(() => {
    showToast(props.args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
};
