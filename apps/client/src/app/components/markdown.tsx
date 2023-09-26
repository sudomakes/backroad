import { ComponentPropsMapping } from 'backroad-core';

export const Markdown = (props: ComponentPropsMapping['markdown']) => {
  return <div>{props.args.body}</div>;
};
