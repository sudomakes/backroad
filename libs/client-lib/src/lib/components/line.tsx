import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BackroadComponentRenderer } from '../types/components';
import autocolors from 'chartjs-plugin-autocolors';

export const LineChart: BackroadComponentRenderer<'line_chart'> = (props) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    autocolors // need to add this to make code less verbose on backroad end
  );

  return <Line {...props.args} />;
};
