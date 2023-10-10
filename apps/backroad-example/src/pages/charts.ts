import { BackroadNodeManager } from '@backroad/backroad';
import { chartData } from '../data/charts-examples';

export const backroadChartsExample = async (br: BackroadNodeManager) => {
  br.bar(chartData.barChart);
  br.pie(chartData.pieChart);
  br.doughnut(chartData.doughnutChart);
  br.radar(chartData.radarChart);
  br.scatter(chartData.scatterChart);
};
