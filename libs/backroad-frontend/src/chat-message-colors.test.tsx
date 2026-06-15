import type { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MessageContent } from 'backroad-ui';
import { Markdown } from 'backroad-components';

/**
 * Regression guard for chat-message contrast.
 *
 * The bug: the user bubble is `bg-primary`, but its text rendered dark and
 * failed contrast. Two contracts must hold to prevent it:
 *   1. Each bubble background is paired with its matching `*-foreground` token.
 *   2. Markdown's `prose` must not impose its own color — otherwise it
 *      overrides the bubble's foreground token and contrast breaks again.
 */
describe('chat message colors', () => {
  it('pairs every bubble background with its matching foreground token', () => {
    const { getByText } = render(<MessageContent>msg</MessageContent>);
    const cls = getByText('msg').className;

    // user bubble
    expect(cls).toContain('group-[.is-user]:bg-primary');
    expect(cls).toContain('group-[.is-user]:text-primary-foreground');
    // assistant bubble
    expect(cls).toContain('group-[.is-assistant]:bg-secondary');
    expect(cls).toContain('group-[.is-assistant]:text-secondary-foreground');
  });

  it('does not let prose own text color (bubble foreground must win)', () => {
    const { container } = render(
      <BrowserRouter>
        <Markdown
          {...({
            args: { body: 'hi claude' },
          } as unknown as ComponentProps<typeof Markdown>)}
        />
      </BrowserRouter>
    );

    const prose = container.querySelector('.prose');
    expect(prose).not.toBeNull();
    // color is neutralised so it inherits from the container...
    expect(prose?.className).toContain('prose-inherit-color');
    // ...and prose's own palette is not re-introduced.
    expect(prose?.className).not.toContain('prose-invert');
    expect(prose?.className).not.toMatch(/\btext-(?!inherit\b)[a-z]/);
  });
});
