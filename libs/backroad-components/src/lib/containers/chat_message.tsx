import { CpuChipIcon, UserIcon } from '@heroicons/react/24/outline';
import { BackroadContainerRenderer } from '../types/containers';
import { Base } from './base';
import { LoadingSpinner } from '../components/loading_spinner';
import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { BackroadContainer } from '@backroad/core';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '../ui/ai-elements/message';

export const ChatMessage: BackroadContainerRenderer<'chat_message'> = (
  props
) => {
  const [loading, setLoading] = useState(
    props.args.loadingPromise !== undefined
  );

  useEffect(() => {
    const handlePropsChange = (
      changedProps: BackroadContainer<'chat_message', true>['args'],
      callback: () => void
    ) => {
      if (!changedProps.loadingPromise && loading) {
        setLoading(false);
      }
      callback();
    };
    socket.on('props_change', handlePropsChange);
    return () => {
      socket.off('props_change', handlePropsChange);
    };
  }, [loading]);

  // Avatar side: explicit `avatarPlacement` wins, otherwise human messages
  // sit on the right (`user`) and everything else on the left (`assistant`).
  const isUser = props.args.avatarPlacement
    ? props.args.avatarPlacement === 'right'
    : props.args.by === 'human';

  return (
    <Message from={isUser ? 'user' : 'assistant'}>
      <MessageContent>
        <Base {...{ ...props, type: 'base' }} />
        {loading && (
          <LoadingSpinner
            path={props.path}
            id={props.path}
            type="loading_spinner"
            value={null}
            args={{ fontSize: 6.5, top: 21, left: 18 }}
          />
        )}
      </MessageContent>
      <MessageAvatar src={props.args.avatar} name={props.args.by}>
        {{ ai: <CpuChipIcon width={20} />, human: <UserIcon width={20} /> }[
          props.args.by
        ] ?? <CpuChipIcon width={20} />}
      </MessageAvatar>
    </Message>
  );
};
