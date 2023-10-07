export const getInitialTreeStructure = () => {
  const structure = {
    children: [
      {
        type: 'page' as const,
        args: {
          path: '/',
        },
        children: [],
        path: 'children.0',
      },
    ],
    path: '',
    type: 'base' as const,
    args: {},
  };
  return JSON.parse(JSON.stringify(structure)) as typeof structure;
};
