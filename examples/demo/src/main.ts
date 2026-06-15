import { run, ChatManager } from '@backroad/backroad';
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

    // const br = brBase.base({});
    br.write({ body: `# Backroad LLM Example\n---` });
    const button = br.button({ label: 'Reset' });
    const chatManager = await ChatManager.create({
      br,
      messagesStateName: 'messages',
      initialMessages,
      inputId: 'input',
    });

    if (chatManager.userInputComplete) {
      const gptResponsePromise = getGPTResponse(
        chatManager.userInput as string
      );
      chatManager.addAIMessage({ by: 'ai', content: gptResponsePromise });
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

const getGPTResponse = async (message: string) => {
  await simulatedDelay();
  if (message.includes('1+1')) {
    return 'Ah, the answer to that is 2!! 😎';
  } else {
    return `I don't know...
    ![i-dont-know](https://t3.ftcdn.net/jpg/05/66/80/74/360_F_566807496_uKCQoOWWdXbFWKluJXo2ilg7B61J0qIe.jpg)`;
  }
};

const simulatedDelay = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
};
