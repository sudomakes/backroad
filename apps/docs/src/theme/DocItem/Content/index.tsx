import type { WrapperProps } from '@docusaurus/types';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import { CopyMarkdownButton } from '@site/src/components/CopyMarkdownButton';

type Props = WrapperProps<typeof ContentType>;

/**
 * Wraps the default DocItem content with a "Copy as markdown" button.
 * Swizzle reference:
 * https://docusaurus.io/docs/swizzling#wrapping
 */
export default function ContentWrapper(props: Props) {
  return (
    <>
      <CopyMarkdownButton />
      <Content {...props} />
    </>
  );
}
