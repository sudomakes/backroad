import { useState } from "react";
import { BackroadComponentRenderer } from "../types/components";
import { handleKeyUpBlur } from "../helpers/handleKeyUp";
import { setBackroadValue } from "../socket";

export const TextInput: BackroadComponentRenderer<"text_input"> = props => {
    const [value, setValue] = useState(props.value)
    return <div className="form-control w-full max-w-xs">
        <label className="label">
            <span className="backroad-label">{props.args.label}</span>
        </label>
        <input type="text" value={value} onKeyUp={handleKeyUpBlur} onBlur={(e) => {
            setBackroadValue({ id: props.id, value: e.target.value })
        }} onChange={(e) => setValue(e.target.value)} placeholder={props.args.placeholder} className="input input-bordered w-full max-w-xs" />
    </div>
}