import { BackroadComponent } from 'backroad-core';

export const Button = (props: BackroadComponent<'button', true>) => {
  return <button className="btn">{props.args.label}</button>;
};
