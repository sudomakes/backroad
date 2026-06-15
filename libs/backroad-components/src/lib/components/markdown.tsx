import { default as ReactMarkdown } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BackroadComponentRenderer } from '../types/components';
import { Link } from 'react-router-dom';

export const Markdown: BackroadComponentRenderer<'markdown'> = (props) => {
  return (
    <div className="prose prose-inherit-color max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => {
            return <Link to={props.href || '/'}>{props.children}</Link>;
          },
          // A horizontally scrollable <pre> must be keyboard-focusable so
          // keyboard users can scroll it (axe rule scrollable-region-focusable).
          // tabIndex alone satisfies this; a role/landmark is NOT added, since
          // multiple same-named regions would trip landmark-unique.
          pre: (props) => (
            <pre className="overflow-x-auto" tabIndex={0} {...props} />
          ),
        }}
      >
        {props.args.body.toString()}
      </ReactMarkdown>
    </div>
  );
};
