import { default as ReactMarkdown } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BackroadComponentRenderer } from '../types/components';

export const Markdown: BackroadComponentRenderer<'markdown'> = (props) => {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {props.args.body.toString()}
      </ReactMarkdown>
    </div>
  );
};
