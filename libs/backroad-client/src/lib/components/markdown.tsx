import { default as ReactMarkdown } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BackroadComponentRenderer } from '../types/components';
import { Link } from 'react-router-dom';

export const Markdown: BackroadComponentRenderer<'markdown'> = (props) => {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => {
            return <Link to={props.href || '/'}>{props.children}</Link>;
          },
        }}
      >
        {props.args.body.toString()}
      </ReactMarkdown>
    </div>
  );
};
