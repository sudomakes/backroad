import { render } from '@testing-library/react';
import { MessageContent } from 'backroad-ui';

/**
 * Regression guard for chat-message contrast.
 *
 * The bug: a bubble background paired with a mismatched (or theme-inverted)
 * foreground rendered low-contrast text. The contract: every bubble background
 * is paired with a matching `*-foreground` token, and the assistant bubble
 * follows the page mode (so the markdown renderer's own token-styled surfaces —
 * tables, code, inline code — never end up dark-on-dark inside it).
 *
 * (The previous `prose-inherit-color` guard is gone: the markdown renderer is
 * now Streamdown, which styles itself with the design tokens directly instead
 * of Tailwind Typography's `prose` palette, so there's nothing to neutralise.)
 */
describe('chat message colors', () => {
  it('pairs every bubble background with its matching foreground token', () => {
    const { getByText } = render(<MessageContent>msg</MessageContent>);
    const cls = getByText('msg').className;

    // user bubble
    expect(cls).toContain('group-[.is-user]:bg-primary');
    expect(cls).toContain('group-[.is-user]:text-primary-foreground');
    // assistant bubble — a mode-consistent surface, not the theme-inverted
    // `secondary` (which some themes render light even under `.dark`).
    expect(cls).toContain('group-[.is-assistant]:bg-muted');
    expect(cls).toContain('group-[.is-assistant]:text-foreground');
  });
});
