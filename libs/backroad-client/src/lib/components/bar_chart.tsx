import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import autocolors from 'chartjs-plugin-autocolors';
import { Bar } from 'react-chartjs-2';
import { BackroadComponentRenderer } from '../types/components';

export const BarChart: BackroadComponentRenderer<'bar_chart'> = (props) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    autocolors // need to add this to make code less verbose on backroad end
  );

  return <Bar {...props.args} />;
};
