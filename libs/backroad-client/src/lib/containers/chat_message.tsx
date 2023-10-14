import { CpuChipIcon, UserIcon } from "@heroicons/react/24/outline"
import { BackroadContainerRenderer } from "../types/containers"
import { Base } from "./base"
const leftAlignClasses = "flex-row text-left"
const rightAlignClasses = "flex-row-reverse !text-right"

export const ChatMessage: BackroadContainerRenderer<"chat_message"> = (props) => {
    return <div className={`flex gap-3 items-start ${props.args.avatarPlacement ? { "left": leftAlignClasses, "right": rightAlignClasses }[props.args.avatarPlacement] : (props.args.name ? {
        "ai": leftAlignClasses, "human": rightAlignClasses
    }[props.args.name] : leftAlignClasses)}`}>
        <div className="bg-primary text-primary-content p-3 rounded-xl">
            {props.args.avatar ? <img src={props.args.avatar} alt={`${props.args.name} message`} /> : { ai: <CpuChipIcon width={24} />, human: <UserIcon width={24} /> }[props.args.name]}
        </div>
        <div className="flex-1">
            <Base {...{ ...props, type: "base" }} />
            {/* {props.children.map(child => <TreeRender tree={child} key={child.path} />)} */}
        </div>
    </div>
}