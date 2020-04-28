import { Message, Emoji } from 'eris';

namespace ReactionManager {
  interface reactionListenerCallback {
    (userId: string, destroy: () => void): void;
  }

  interface configuration {
    autoDestroy: any;
    reactionListeners: Map<string, reactionListenerCallback>;
  }

  const reactiveMessages: Map<string, configuration> = new Map();

  export const reactionHandler = (
    message: Message,
    emoji: any,
    userId: string,
  ) => {
    const { channel } = message;
    const { client } = channel;
    const reactiveMessageKey = `${channel.id}:${message.id}`;
    const reactiveMessage = reactiveMessages.get(reactiveMessageKey);
    const reactedEmoji = emoji.id || emoji.name || emoji;

    if (
      reactiveMessage?.reactionListeners?.get(reactedEmoji) &&
      userId !== client.user.id
    ) {
      const callback = reactiveMessage.reactionListeners.get(reactedEmoji);

      callback(userId, () => reactiveMessages.delete(reactiveMessageKey));
    }
  };

  interface addReactionListenerArgs {
    message: Message;
    emoji: any;
    autoDestroy: number;
    callback: reactionListenerCallback;
  }

  export const addReactionListener = ({
    message,
    emoji,
    autoDestroy = 5 * 60 * 1000,
    callback,
  }: addReactionListenerArgs) => {
    const { channel } = message;
    const reactiveMessageKey = `${channel.id}:${message.id}`;
    const reactiveMessage = reactiveMessages.get(reactiveMessageKey);

    if (!reactiveMessage) {
      reactiveMessages.set(reactiveMessageKey, {
        reactionListeners: new Map(),
        autoDestroy: autoDestroy
          ? setTimeout(
              () => reactiveMessages.delete(reactiveMessageKey),
              autoDestroy,
            )
          : null,
      });
    }

    reactiveMessages
      .get(reactiveMessageKey)
      .reactionListeners.set(emoji.id || emoji.name || emoji, callback);
  };
}

export default ReactionManager;