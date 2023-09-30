import { BackroadNodeManager } from 'backroad-sdk';

const labels = ['2020', '2021', '2022', '2023'];

export const backroadChartsExample = async (br: BackroadNodeManager) => {
  await br.line({
    data: {
      labels,
      datasets: [
        {
          label: "Deep's CGPA over time",
          data: labels.map((_, idx) => 9 - idx),
        },
        {
          label: "Vaibhav's CGPA Over time",
          data: labels.map(() => 9.5),
        },
      ],
    },
  });
};
