import { BackroadNodeManager } from '@backroad/backroad';

export const backroadStatsExample = async (br: BackroadNodeManager) => {
  br.stats({
    items: [
      { label: 'My Knowledge', value: 100, delta: '+10' },
      { label: 'My Patience', value: 0, delta: '-50%' },
    ],
  });
  const num = await br.numberInput({ label: 'a' });
};
