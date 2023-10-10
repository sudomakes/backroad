import { Scatter } from "react-chartjs-2";
import { BackroadComponentRenderer } from "../types/components";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import autocolors from 'chartjs-plugin-autocolors';
export const ScatterChart: BackroadComponentRenderer<"scatter_chart"> = (props) => {

    ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, autocolors);

    return <Scatter {...props.args} />
}
