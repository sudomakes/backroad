import { BackroadNodeManager } from '@backroad/backroad';

export const backroadSelectExample = (br: BackroadNodeManager) => {
  const sidebar = br.sidebar({});
  const value = sidebar.select({
    options: [
      { value: 'Amol', label: 'Amol' },
      { value: 'Sangeeth', label: 'Sangeeth' },
      { value: 'No One', label: 'No One' },
    ],

    label: 'Who is the best leetcoder?',
  });
  if (value) {
    br.write({ body: `## You selected ${value}` });
    if (value === 'Amol') {
      br.write({
        body: `### Makes sense, he has 1000+ problems solved 🚀`,
      });
      br.image({
        src: 'https://media.tenor.com/-BVQhBulOmAAAAAC/bruce-almighty-morgan-freeman.gif',
      });
    } else if (value === 'Sangeeth') {
      br.write({
        body: `### koi SIGKILL bhejdo mereko please!! 😭`,
      });
      br.collapse({ label: 'spoiler alert!!' }).image({
        src: 'https://s.keepmeme.com/files/en_posts/20200818/7848c2160135eb558ba3b3429c07a184disappointed-bald-man-standing-disappointed-cricket-fan-meme.jpg',
      });
    }
  }

  const multiValue = br.multiselect({
    options: [
      { value: 'Pink', label: 'Pink' },
      { value: 'Red', label: 'Red' },
      { value: 'Green', label: 'Green' },
    ],
    label: 'Select your favourite colors',
  });
  br.json({
    src: multiValue,
  });
};
