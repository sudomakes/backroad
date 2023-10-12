import { useState } from "react"
import { BackroadComponentRenderer } from "../types/components"
import { setBackroadValue } from "../socket"

export const Radio: BackroadComponentRenderer<"radio"> = (props) => {
    const [value, setValue] = useState(props.value)
    return <div className="form-control w-full max-w-xs">
        <label className="label">
            <span className="backroad-label">{props.args.label}</span>
        </label>
        {props.args.options.map(option => {
            return <div className="form-control" key={option}>
                <label className="label cursor-pointer">
                    <span className="label-text" >{option}</span>
                    <input type="radio" name={props.id} value={option} checked={value === option} onChange={(e) => {
                        if (e.target.checked) {
                            setValue(option)
                            setBackroadValue({ id: props.id, value: option })
                        }
                    }} className="radio radio-primary" />
                </label>
            </div>
        })}

    </div>

}