import { type BackroadNodeManager } from '../backroad';
import { type ManagerArgsMapping } from '@backroad/core';

type ChatManagerProps = {
  br: BackroadNodeManager<'page'>;
  messagesStateName: string;
  initialMessages: ManagerArgsMapping['chat_manager']['args']['messages'];
  inputId: string;
};

export class ChatManager {
  private br: ChatManagerProps['br'];
  private messagesStateName: ChatManagerProps['messagesStateName'];
  private initialMessages: ChatManagerProps['initialMessages'];
  private messages: ChatManagerProps['initialMessages'];
  private inputId: string;
  userInput: string | null;
  userInputComplete: boolean;
  awaitingLlmResponse = false;
  constructor(props: ChatManagerProps) {
    this.br = props.br;
    this.messagesStateName = props.messagesStateName;
    this.initialMessages = props.initialMessages;
    this.inputId = props.inputId;
    this.messages = props.br.getOrDefault(
      props.messagesStateName,
      props.initialMessages
    );
    this.userInput = null;
    this.userInputComplete = false;
    this.initialize(props.inputId);
  }
  private initialize(inputId: string) {
    if (
      !this.messages.every(
        (message) => message.by === 'ai' || message.by === 'human'
      )
    ) {
      throw new Error('All chat messages must be by either "ai" or "human"');
    }
    this.messages
      .filter((message) => typeof message.content === 'string')
      .forEach(({ by, content }) => {
        this.br.chatMessage({ by }).write({ body: content as string });
      });

    // Only show chat input if the last message was from an llm
    if (this.messages.slice(-1)[0].by === 'ai') {
      this.userInput = this.br.chatInput({ id: inputId });
    }

    if (this.userInput) {
      this.br.setValue(this.messagesStateName, [
        ...this.messages,
        { by: 'human', content: this.userInput },
      ]);
    } else if (this.messages.slice(-1)[0].by === 'human') {
      this.userInputComplete = true;
      this.userInput = this.messages.slice(-1)[0].content as string;
    }
  }

  addAIMessage(
    message: ManagerArgsMapping['chat_manager']['args']['messages'][0]
  ) {
    const chatMessage = this.br.chatMessage({
      by: message.by,
      loadingPromise:
        typeof message.content !== 'string' ? message.content : undefined,
    });
    this.userInput = this.br.chatInput({ id: this.inputId });
    if (typeof message.content !== 'string') {
      message.content.then((body) => {
        this.br.setValue(this.messagesStateName, [
          ...this.messages,
          { ...message, content: body },
        ]);
        this.messages = this.br.getOrDefault(
          this.messagesStateName,
          this.initialMessages
        );
        chatMessage.write({ body });
      });
    } else {
      this.br.setValue(this.messagesStateName, [...this.messages, message]);
      this.messages = this.br.getOrDefault(
        this.messagesStateName,
        this.initialMessages
      );
      chatMessage.write({ body: message.content });
    }
  }
}
