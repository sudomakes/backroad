import { BackroadNodeManager } from 'backroad';

export const backroadSelectExample = async (br: BackroadNodeManager) => {
  const sidebar = await br.sidebar({});
  const value = await sidebar.select({
    options: [
      { value: 'Amol', label: 'Amol' },
      { value: 'Sangeeth', label: 'Sangeeth' },
    ],
    label: 'Who is the best leetcoder?',
  });
  if (value) {
    await br.write({ body: `## You selected ${value}` });
    if (value === 'Amol') {
      await br.write({
        body: `### Makes sense, he has 1000+ problems solved 🚀`,
      });
      await br.image({
        src: 'https://media.tenor.com/-BVQhBulOmAAAAAC/bruce-almighty-morgan-freeman.gif',
      });
    } else if (value === 'Sangeeth') {
      await br.write({
        body: `### koi SIGKILL bhejdo mereko please!! 😭`,
      });
      await br.image({
        src: 'https://s.keepmeme.com/files/en_posts/20200818/7848c2160135eb558ba3b3429c07a184disappointed-bald-man-standing-disappointed-cricket-fan-meme.jpg',
      });
    }
  }
};
