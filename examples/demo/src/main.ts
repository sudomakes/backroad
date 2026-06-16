import { run } from '@backroad/backroad';
import { pages } from './pages';
import { buildAuth } from './auth';

const initialMessages = [
  { by: 'ai', content: 'Hi, how can I help you today? 😀' },
];
const auth = buildAuth();

run(
  async (br, { currentPath }) => {
    // Auth gate: only enforced when auth env vars are configured. Mirrors
    // Streamlit's top-of-script `if not st.user.is_logged_in: ...` pattern.
    if (auth && !br.user.isLoggedIn) {
      br.write({ body: '## Please log in to continue' });
      const loginClicked = br.button({ label: 'Log in' });
      if (loginClicked) {
        br.login();
      }
      return;
    }

    if (auth && br.user.isLoggedIn) {
      br.write({ body: `Hello, **${br.user.name || br.user.email}** 👋` });
      const logoutClicked = br.button({ label: 'Log out' });
      if (logoutClicked) {
        br.logout();
        return;
      }
    }

    // Sidebar navigation — lists every demo page with a clickable link.
    const sb = br.sidebar({});
    sb.write({ body: '## Backroad Demo' });
    sb.link({ label: '🏠 Home', href: '/' });
    sb.write({ body: '---' });
    sb.link({ label: '📝 Markdown', href: '/markdown' });
    sb.link({ label: '📊 Charts', href: '/charts' });
    sb.link({ label: '📋 Form', href: '/form' });
    sb.link({ label: '🔽 Select', href: '/select' });
    sb.link({ label: '📈 Stats', href: '/stats' });
    sb.link({ label: '📐 Columns', href: '/columns' });
    sb.link({ label: '🎛️ Widgets', href: '/widgets' });
    sb.link({ label: '📁 File Upload', href: '/file-upload' });
    sb.write({ body: '---' });
    sb.write({ body: `📍 \`${currentPath}\`` });

    pages.fileUpload(br.page({ path: '/file-upload' }));
    pages.iframe(br.page({ path: '/iframe' }));
    pages.form(br.page({ path: '/form' }));
    pages.markdown(br.page({ path: '/markdown' }));
    pages.select(br.page({ path: '/select' }));
    pages.stats(br.page({ path: '/stats' }));
    pages.columns(br.page({ path: '/columns' }));
    pages.charts(br.page({ path: '/charts' }));
    pages.widgets(br.page({ path: '/widgets' }));

    // const br = brBase.base({});
    br.write({ body: `# Backroad LLM Example\n---` });
    const button = br.button({ label: 'Reset' });

    // Streamlit-style chat: the SCRIPT owns the message history. Replay the
    // stored messages, read the input, and on submit stream the AI turn into a
    // single bubble — then persist both messages so the next rerun replays
    // them. No ChatManager; `writeStream` is the only streaming primitive used.
    const messages = br.getOrDefault('messages', initialMessages);
    messages.forEach((message) => {
      br.chatMessage({ by: message.by }).write({ body: message.content });
    });
    const input = br.bottom().chatInput({ id: 'input' });
    if (input) {
      br.chatMessage({ by: 'human' }).write({ body: input });
      const reply = await br
        .chatMessage({ by: 'ai' })
        .writeStream(streamGPTResponse(input));
      br.setValue('messages', [
        ...messages,
        { by: 'human', content: input },
        { by: 'ai', content: reply },
      ]);
    }

    if (button) {
      br.setValue('messages', initialMessages);
    }
  },
  {
    // Recommended defaults; users can change palette/mode in settings and
    // their choice is remembered (persisted client-side, wins over these).
    appearance: {
      theme: 'claude',
      mode: 'light',
    },
    analytics: {
      google: 'G-77B7VHC5Z8',
    },
    ...(auth ? { auth: { instance: auth } } : {}),
  }
);

// A stand-in for a real LLM token stream. Returns a long, rich markdown
// answer that exercises everything the Streamdown renderer can do — syntax
// highlighting, tables, task lists, blockquotes, a Mermaid diagram, and KaTeX
// math — so streaming shows its full range. Swap this for an
// OpenAI/Anthropic/Vercel-AI-SDK stream mapped to `AsyncIterable<string>`.
async function* streamGPTResponse(message: string): AsyncGenerator<string> {
  const text = richAnswer(message);
  // Stream word-by-word so unterminated markdown (half-open code fences,
  // tables, diagrams) is parsed gracefully as it arrives.
  for (const word of text.split(' ')) {
    await new Promise((resolve) => setTimeout(resolve, 60));
    yield word + ' ';
  }
}

const richAnswer = (message: string) => `## Streaming a debounce, two ways

Great question about **"${message.trim() || 'how streaming works'}"** — here's a
quick tour. A debounce delays a call until input settles; below it is in both
Python and TypeScript, plus when to reach for each.

| Language   | Typing       | Best for                    | Async-native |
| ---------- | ------------ | --------------------------- | :----------: |
| Python     | gradual      | data & ML scripts           |      ✅       |
| TypeScript | structural   | UI & full-stack apps        |      ✅       |

\`\`\`python
import asyncio
from typing import Callable

def debounce(wait: float) -> Callable:
    """Coalesce rapid calls into the last one after \`wait\` seconds."""
    def decorator(fn):
        task: asyncio.Task | None = None

        async def wrapper(*args, **kwargs):
            nonlocal task
            if task:
                task.cancel()
            async def later():
                await asyncio.sleep(wait)
                return await fn(*args, **kwargs)
            task = asyncio.create_task(later())
        return wrapper
    return decorator
\`\`\`

The TypeScript version leans on \`setTimeout\` and closures instead:

\`\`\`ts
function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number,
): (...args: A) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
\`\`\`

> **Heads up:** a *trailing* debounce that resets on every keystroke never
> fires during a continuous stream — which is exactly why streamed tokens
> should flush on a microtask, not a timer.

### How a request actually flows

\`\`\`mermaid
flowchart LR
  U[User types] --> D{debounced?}
  D -- no --> Q[queue render]
  D -- yes --> W[wait for pause]
  W --> Q
  Q --> S[(server)]
  S --> R[stream tokens back]
\`\`\`

A little math, since debouncing is really about rate. If events arrive every
$\\Delta t$ seconds and the debounce window is $w$, the effective flush rate is:

$$
f = \\frac{1}{\\max(\\Delta t,\\ w)}
$$

### To wire this in

- [x] Pick a debounce strategy (leading / trailing)
- [x] Render the answer as it streams
- [ ] Swap this stub for a real LLM \`textStream\`
- [ ] Persist the final message to your history

Ask me to expand any section and I'll stream the next part in. ✨`;
