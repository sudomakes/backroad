import { BackroadNodeManager } from '@backroad/backroad';

// Exercises the value-returning widgets (text_area, slider, date_input,
// time_input) plus the imperative toast. Each value is echoed back into the
// page so the e2e spec can assert the round-trip: change a widget → script
// reruns → echo updates.
export const backroadWidgetsExample = (br: BackroadNodeManager) => {
  br.write({ body: '# Widgets' });

  const bio = br.textArea({
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    defaultValue: '',
  });
  br.write({ body: `Bio length: ${bio.length}` });

  const volume = br.slider({
    label: 'Volume',
    min: 0,
    max: 100,
    defaultValue: 30,
  });
  br.write({ body: `Volume is ${volume}` });

  const date = br.dateInput({ label: 'Start date', defaultValue: '2026-06-15' });
  br.write({ body: `Date: ${date || 'none'}` });

  const time = br.timeInput({ label: 'Reminder at', defaultValue: '09:00' });
  br.write({ body: `Time: ${time || 'none'}` });

  // `notify` is true only on the run right after the click, so the toast fires
  // once per press. A longer duration keeps it on screen for the e2e assertion.
  const notify = br.button({ label: 'Notify' });
  if (notify) {
    br.toast({
      message: 'Saved your preferences!',
      variant: 'success',
      duration: 6000,
    });
  }
};
