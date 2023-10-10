import { CpuChipIcon, UserIcon } from "@heroicons/react/24/outline"
import { BackroadContainerRenderer } from "../types/containers"
import { TreeRender } from "../tree"
import { Base } from "./base"

export const ChatMessage: BackroadContainerRenderer<"chat_message"> = (props) => {
    return <div className="flex gap-3 items-start">
        <div className="bg-primary text-primary-content p-3 rounded-xl">

            {props.args.avatar ? <img src={props.args.avatar} alt={`${props.args.name} message`} /> : { ai: <CpuChipIcon width={24} />, human: <UserIcon width={24} /> }[props.args.name]}
        </div>
        <div className="flex-1">
            <Base {...{ ...props, type: "base" }} />
            {/* {props.children.map(child => <TreeRender tree={child} key={child.path} />)} */}
        </div>
    </div>
}