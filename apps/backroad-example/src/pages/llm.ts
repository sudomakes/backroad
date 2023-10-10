import { BackroadNodeManager } from '@backroad/backroad';

export const backroadLLMExample = async (br: BackroadNodeManager) => {
  br.write({
    body: `# LLM Example
---`,
  });

  const human = br.chatMessage({ name: 'human' });
  human.write({
    body: `tell me the output for the following program:
~~~
print("hello world!")
~~~`,
  });
  const ai = br.chatMessage({ name: 'ai' });
  ai.write({ body: `I don't know!!` });
  ai.image({
    src: 'https://preview.redd.it/a8pg715pv0da1.png?auto=webp&s=54b21a22a57119d13cf68286572a05f1fd471d9e',
    width: 300,
    style: {
      borderRadius: '50%',
    },
  });
};
