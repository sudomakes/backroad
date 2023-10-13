import { BackroadComponentRenderer } from "../types/components";

export const Video: BackroadComponentRenderer<"video"> = props => {
    return <video controls {...props.args}></video>
}