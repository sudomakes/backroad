import { useState } from "react";
import { BackroadContainerRenderer } from "../types/containers";
import { TreeRender } from "../tree";

export const Tabs: BackroadContainerRenderer<"tabs"> = (props) => {
    const [activeLabelIdx, setActiveLabelIdx] = useState(0)
    return <div>
        <div className="tabs">
            {props.args.labels.map((label, idx) => {
                return <span key={label} className={`tab tab-lifted ${activeLabelIdx === idx && "tab-active"}`} onClick={() => setActiveLabelIdx(idx)}>{label}</span>
            })}
            <div className="flex-1 border-b-[1px]"></div>
        </div>
        <div className="mt-4">
            {props.children.map((child, idx) => {
                if (activeLabelIdx === idx) {
                    return <TreeRender tree={child} key={child.path} />
                }
                return null;
            })}
        </div>
    </div>
}