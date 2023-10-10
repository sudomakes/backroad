import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { BackroadComponentRenderer } from '../types/components';
import autocolors from 'chartjs-plugin-autocolors';
export const RadarChart: BackroadComponentRenderer<"radar_chart"> = (props) => {

    ChartJS.register(
        RadialLinearScale,
        PointElement,
        LineElement,
        Filler,
        Tooltip,
        Legend,
        autocolors
    );
    return <Radar {...props.args} />
}