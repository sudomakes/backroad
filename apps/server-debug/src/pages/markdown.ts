import { BackroadNodeManager } from 'backroad';

export const backroadMarkdownExample = async (br: BackroadNodeManager) => {
  br.write({
    body: `# Markdown Example
    ### Can make tables too  😱
    | foo | bar |
    | --- | --- |
    | baz | bim |
  
    ### How about rendering some code
  
    ~~~python
    print("Hello World")
    ~~~
      `,
  });
};
