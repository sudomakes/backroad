import { BackroadNodeManager } from '@backroad/backroad';

export const backroadLLMExample = async (br: BackroadNodeManager) => {
  const messages = br.getOrDefault('messages', [
    { by: 'ai', content: 'Hi, how can I help you today? 😀' },
  ]);
  br.write({ body: `# LLM Example\n---` });
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

  br.collapse({ label: 'Show Code' }).write({
    body: `
~~~

const messages: { by: string; content: string }[] = [];

export const backroadLLMExample = async (br: BackroadNodeManager) => {
  const messagesContainer = br.base({});
  messages.forEach(async (message, idx) => {
    if (idx === messages.length - 1) await simulatedDelay();
    messagesContainer
      .chatMessage({ name: message.by })
      .write({ body: message.content });
  });
  const messageFromInput = br.chatInput({
    placeholder: 'Type Something Here',
    id: 'chat-input',
  });
  if (messageFromInput) {
    messages.push({ by: 'human', content: messageFromInput });
    messages.push({ by: 'ai', content: getGPTResponse(messageFromInput) });
  }
};
~~~
`,
  });
};

const getGPTResponse = (message: string) => {
  if (message.includes('1+1')) {
    return 'Ah, the answer to that is 2!! 😎';
  } else {
    return `I don't know...
    ![i-dont-know](https://t3.ftcdn.net/jpg/05/66/80/74/360_F_566807496_uKCQoOWWdXbFWKluJXo2ilg7B61J0qIe.jpg)`;
  }
};

const simulatedDelay = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
};
