import { BackroadNodeManager } from '@backroad/backroad';
import { chartData } from '../data/charts-examples';
export const backroadChartsExample = async (br: BackroadNodeManager) => {
  br.bar(chartData.barChart);
  br.pie(chartData.pieChart);
  br.doughnut(chartData.doughnutChart);
  br.radar(chartData.radarChart);
  br.scatter(chartData.scatterChart);

  const [col1, col2] = br.columns({ columns: 2 });
  const amount = col1.numberInput({ label: 'Investment ($)' });
  const rate = col1.numberInput({ label: 'Interest (%)' });
  const years = col1.radio({
    options: ['5 Years', '10 Years', '15 Years'],
    label: 'Period',
  });
  const [finalAmount, chartProps] = doMath(amount, rate, years);
  col1.write({ body: `## Final Amount: $${finalAmount.toFixed()}` });
  col2.pie(chartProps);
};

const doMath = (amount: number, rate: number, years: string) => {
  const period = { '5 Years': 5, '10 Years': 10, '15 Years': 15 }[years]!;
  const finalAmount = amount * Math.pow(1 + rate / 100, period);
  const chartData = {
    data: {
      datasets: [
        {
          data: [amount, finalAmount - amount],
          backgroundColor: ['#ff7ac6', '#bf95f9'],
        },
      ],
      labels: ['Initial Amount', 'Interest'],
    },
  };
  return [finalAmount, chartData] as const;
};
