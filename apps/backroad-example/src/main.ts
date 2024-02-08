import { run, ChatManager } from '@backroad/backroad';
import { pages } from './pages';

const initialMessages = [
  { by: 'ai', content: 'Hi, how can I help you today? 😀' },
];
run(
  (br) => {
    pages.fileUpload(br.page({ path: '/file-upload' }));
    const page2 = br.page({ path: '/page-2' });
    page2.write({ body: 'hello from page 2' });
    // const br = brBase.base({});
    br.write({ body: `# Backroad LLM Example\n---` });
    const button = br.button({ label: 'Reset' });
    const chatManager = new ChatManager({
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
    theme: 'dark',
    analytics: {
      google: 'G-77B7VHC5Z8',
    },
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
