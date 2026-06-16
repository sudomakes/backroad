import { type BackroadNodeManager } from '.';
import { type ManagerArgsMapping } from '@backroad/core';

type ChatManagerProps = {
  br: BackroadNodeManager<'page'>;
  messagesStateName: string;
  initialMessages: ManagerArgsMapping['chat_manager']['args']['messages'];
  inputId: string;
};

/**
 * @deprecated Prefer the streaming primitives on `BackroadNodeManager`. Let the
 * script own its message state and stream the AI turn with
 * `br.chatMessage({ by: 'ai' }).writeStream(stream)` — see `examples/demo`.
 * `ChatManager` pulls message-history ownership into the framework and renders
 * AI replies all-at-once instead of streaming; it is kept only for backwards
 * compatibility and will be removed in a future release.
 */
export class ChatManager {
  private br: ChatManagerProps['br'];
  private messagesStateName: ChatManagerProps['messagesStateName'];
  private initialMessages: ChatManagerProps['initialMessages'];
  private messages: ChatManagerProps['initialMessages'];
  private inputId: string;
  userInput: string | null;
  userInputComplete: boolean;
  awaitingLlmResponse = false;
  // Use `await ChatManager.create(...)`. The constructor only does synchronous
  // setup; `initialize` is async (a stored message's content may be a
  // Promise<string> that must be awaited), and it must finish before callers
  // read `userInput`/`userInputComplete` — so construction is gated behind an
  // awaited factory rather than a fire-and-forget call in the constructor.
  private constructor(props: ChatManagerProps) {
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
  }
  static async create(props: ChatManagerProps): Promise<ChatManager> {
    const manager = new ChatManager(props);
    await manager.initialize(props.inputId);
    return manager;
  }
  private async initialize(inputId: string) {
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

    // Render the input once, unconditionally, docked in a `bottom` container.
    // It used to be emitted only when the last message was from the llm — and
    // re-emitted again inside addAIMessage — purely to keep it ordered *below*
    // the newest message in normal flow. The dock pins it to the bottom of the
    // frame regardless of emit order, so a single render here is enough.
    const inputValue = this.br.bottom().chatInput({ id: inputId });

    const lastMessage = this.messages.slice(-1)[0];
    if (inputValue) {
      // The user just submitted a prompt — record it so the next run drives the
      // llm turn (where lastMessage will be this human message).
      this.userInput = inputValue;
      this.br.setValue(this.messagesStateName, [
        ...this.messages,
        { by: 'human', content: inputValue },
      ]);
    } else if (lastMessage.by === 'human') {
      this.userInputComplete = true;
      this.userInput = await lastMessage.content;
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
