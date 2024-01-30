import { run } from '@backroad/backroad';
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
    const messages = br.getOrDefault('messages', initialMessages);
    br.write({ body: `# Backroad LLM Example\n---` });
    const button = br.button({ label: 'Reset' });
    messages.forEach((message) => {
      br.chatMessage({ name: message.by }).write({ body: message.content });
    });
    const input = br.chatInput({ id: 'input' });
    if (input) {
      br.setValue('messages', [
        ...messages,
        { by: 'human', content: input },
        { by: 'ai', content: getGPTResponse(input) },
      ]);
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

const getGPTResponse = (message: string) => {
  if (message.includes('1+1')) {
    return 'Ah, the answer to that is 2!! 😎';
  } else {
    return `I don't know...
    ![i-dont-know](https://t3.ftcdn.net/jpg/05/66/80/74/360_F_566807496_uKCQoOWWdXbFWKluJXo2ilg7B61J0qIe.jpg)`;
  }
};
