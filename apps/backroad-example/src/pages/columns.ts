import { BackroadNodeManager } from '@backroad/backroad';

export const backroadColumnsExample = async (br: BackroadNodeManager) => {
  const [col1, col2, col3] = await br.columns({
    columnCount: 3,
  });

  col1.write({ body: `## Column 1` });
  col2.write({ body: `## Column 2` });
  col3.write({ body: `## Column 3` });
};
