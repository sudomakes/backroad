import { CpuChipIcon, UserIcon } from '@heroicons/react/24/outline';
import { BackroadContainerRenderer } from '../types/containers';
import { Base } from './base';
import { LoadingSpinner } from '../components/loading_spinner';
import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { BackroadContainer } from '@backroad/core';
const leftAlignClasses = 'flex-row text-left';
const rightAlignClasses = 'flex-row-reverse !text-right';

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
  return (
    <div
      className={`flex gap-3 items-start ${
        props.args.avatarPlacement
          ? { left: leftAlignClasses, right: rightAlignClasses }[
              props.args.avatarPlacement
            ]
          : props.args.by
          ? {
              ai: leftAlignClasses,
              human: rightAlignClasses,
            }[props.args.by]
          : leftAlignClasses
      }`}
    >
      <div className="bg-primary text-primary-content p-3 rounded-xl">
        {props.args.avatar ? (
          <img src={props.args.avatar} alt={`${props.args.by} message`} />
        ) : (
          { ai: <CpuChipIcon width={24} />, human: <UserIcon width={24} /> }[
            props.args.by
          ]
        )}
      </div>
      <div className="flex-1">
        <Base {...{ ...props, type: 'base' }} />
        {/* {props.children.map(child => <TreeRender tree={child} key={child.path} />)} */}
        {loading && (
          <LoadingSpinner
            path={props.path}
            id={props.path}
            type="loading_spinner"
            value={null}
            args={{ fontSize: 6.5, top: 21, left: 18 }}
          />
        )}
      </div>
    </div>
  );
};
