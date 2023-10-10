import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip
} from 'chart.js';
import autocolors from 'chartjs-plugin-autocolors';
import { Pie } from 'react-chartjs-2';
import { BackroadComponentRenderer } from '../types/components';

export const PieChart: BackroadComponentRenderer<'pie_chart'> = (props) => {
    ChartJS.register(ArcElement, Tooltip, Legend, autocolors);

    return <Pie {...props.args} />;
};
