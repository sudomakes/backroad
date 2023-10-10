
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { BackroadComponentRenderer } from '../types/components';
import autocolors from 'chartjs-plugin-autocolors';
export const DoughnutChart: BackroadComponentRenderer<"doughnut_chart"> = (props) => {

    ChartJS.register(ArcElement, Tooltip, Legend, autocolors);

    return <Doughnut {...props.args} />;
}