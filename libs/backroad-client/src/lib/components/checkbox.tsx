import { useState } from "react";
import { BackroadComponentRenderer } from "../types/components";
import { setBackroadValue } from "../socket";

export const Checkbox: BackroadComponentRenderer<"checkbox"> = props => {
    const [value, setValue] = useState(props.value)
    return <div className="flex gap-3 items-center">
        <input type="checkbox" className="checkbox checkbox-primary" checked={value} onChange={(e) => {
            const newValue = e.target.checked
            setValue(newValue)
            setBackroadValue({ id: props.id, value: newValue })
        }} />
        <span className="flex-1">{props.args.label}</span>
    </div>
}