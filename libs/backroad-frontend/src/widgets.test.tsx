import { render, fireEvent } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { backroadClientComponents, socket, showToast } from 'backroad-components';
import { toast as uiToast } from 'backroad-ui';

// Mock the `toast`/`Toaster` surface of backroad-ui (which re-exports sonner)
// so the `toast` renderer's imperative call is observable without a real
// <Toaster> mounted. The other primitives (Input, Label, Slider, Textarea)
// stay real via the spread, so the value widgets still render normally.
vi.mock('backroad-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('backroad-ui')>();
  return {
    ...actual,
    Toaster: () => null,
    toast: Object.assign(vi.fn(), {
      info: vi.fn(),
      success: vi.fn(),
      warning: vi.fn(),
      error: vi.fn(),
    }),
  };
});

// Commit path: every value widget pushes through socket.emit('set_value', …).
// Spy on the shared client instead of the network so we can assert the commit.
let emit: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  emit = vi.spyOn(socket, 'emit').mockReturnValue(socket as never);
});
afterEach(() => {
  vi.clearAllMocks();
});

const committedIds = () =>
  (emit.mock.calls as unknown as Array<[string, { id: string }]>)
    .filter(([event]) => event === 'set_value')
    .map(([, payload]) => payload.id);

describe('text_area', () => {
  const TextArea = backroadClientComponents.text_area;
  const props = (value = '') => ({
    path: 't',
    id: 'ta',
    type: 'text_area' as const,
    value,
    args: { label: 'Feedback' },
  });

  it('commits the typed value on blur (not on every keystroke)', () => {
    const { getByLabelText } = render(<TextArea {...props()} />);
    const el = getByLabelText('Feedback');
    fireEvent.change(el, { target: { value: 'multi\nline' } });
    // Typing alone must not commit — that would rerun the script per keystroke.
    expect(committedIds()).not.toContain('ta');
    fireEvent.blur(el);
    expect(committedIds()).toContain('ta');
  });
});

describe('date_input', () => {
  const DateInput = backroadClientComponents.date_input;
  const props = (value = '') => ({
    path: 't',
    id: 'd',
    type: 'date_input' as const,
    value,
    args: { label: 'Start date' },
  });

  it('commits the ISO date string on change', () => {
    const { getByLabelText } = render(<DateInput {...props()} />);
    fireEvent.change(getByLabelText('Start date'), {
      target: { value: '2026-06-20' },
    });
    expect(committedIds()).toContain('d');
  });
});

describe('time_input', () => {
  const TimeInput = backroadClientComponents.time_input;
  const props = (value = '') => ({
    path: 't',
    id: 'tm',
    type: 'time_input' as const,
    value,
    args: { label: 'Reminder at' },
  });

  it('commits the HH:mm string on change', () => {
    const { getByLabelText } = render(<TimeInput {...props()} />);
    fireEvent.change(getByLabelText('Reminder at'), {
      target: { value: '09:30' },
    });
    expect(committedIds()).toContain('tm');
  });
});

describe('slider', () => {
  const Slider = backroadClientComponents.slider;
  const props = (value = 0) => ({
    path: 't',
    id: 's',
    type: 'slider' as const,
    value,
    args: { label: 'Volume', min: 0, max: 100 },
  });

  it('exposes an accessible slider reflecting the current value', () => {
    const { getByRole, getByText } = render(<Slider {...props(65)} />);
    const slider = getByRole('slider');
    expect(slider.getAttribute('aria-valuenow')).toBe('65');
    // Visible mirror of the thumb position for sighted users.
    expect(getByText('65')).toBeTruthy();
  });
});

// `toast` is an action (a `toast_show` socket event), not a rendered component,
// so we test the client handler that maps the event onto sonner.
describe('toast (showToast handler)', () => {
  it('routes each variant to the matching sonner call', () => {
    showToast({ message: 'Saved!', variant: 'success', duration: 0 });
    expect(uiToast.success).toHaveBeenCalledTimes(1);
    // duration 0 → sonner's "stay until dismissed".
    expect(uiToast.success).toHaveBeenCalledWith('Saved!', {
      duration: Infinity,
    });
  });

  it('defaults to the info variant and a 5s duration when unspecified', () => {
    showToast({ message: 'Heads up' });
    expect(uiToast.info).toHaveBeenCalledWith('Heads up', { duration: 5000 });
  });

  it('passes an explicit finite duration through', () => {
    showToast({ message: 'Quick one', variant: 'warning', duration: 2000 });
    expect(uiToast.warning).toHaveBeenCalledWith('Quick one', {
      duration: 2000,
    });
  });
});
