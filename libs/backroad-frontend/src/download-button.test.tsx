import { render, fireEvent } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { backroadClientComponents, socket } from 'backroad-components';

// Commit path: clicking the download button pushes through
// socket.emit('set_value', …) (then an unset). Spy on the shared client
// instead of the network so we can assert the commit.
let emit: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  emit = vi.spyOn(socket, 'emit').mockReturnValue(socket as never);
  // jsdom would attempt a real (unimplemented) navigation on the anchor click;
  // stub it so the download path is exercised without the noise.
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(
    () => undefined
  );
});
afterEach(() => {
  vi.clearAllMocks();
});

const committedIds = () =>
  (emit.mock.calls as unknown as Array<[string, { id: string }]>)
    .filter(([event]) => event === 'set_value')
    .map(([, payload]) => payload.id);

describe('download_button', () => {
  const DownloadButton = backroadClientComponents.download_button;
  const props = () => ({
    path: 't',
    // The payload lives server-side; the rendered node only carries the label.
    id: 'db',
    type: 'download_button' as const,
    value: false,
    args: { label: 'Download Report' },
  });

  it('renders an accessible button with the provided label', () => {
    const { getByRole } = render(<DownloadButton {...props()} />);
    expect(getByRole('button', { name: 'Download Report' })).toBeTruthy();
  });

  it('fetches the payload from the server route and commits on click', () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click');
    const hrefs: string[] = [];
    const setAttr = vi
      .spyOn(HTMLAnchorElement.prototype, 'href', 'set')
      .mockImplementation(function (this: HTMLAnchorElement, value: string) {
        hrefs.push(value);
      });

    const { getByRole } = render(<DownloadButton {...props()} />);
    fireEvent.click(getByRole('button', { name: 'Download Report' }));

    // A transient anchor points at the on-demand download route for this id…
    expect(hrefs[0]).toContain('/api/download/');
    expect(hrefs[0]).toContain('/db');
    expect(clickSpy).toHaveBeenCalledTimes(1);

    // …and the click commits value true so the script reruns server-side.
    expect(committedIds()).toContain('db');

    setAttr.mockRestore();
  });
});
