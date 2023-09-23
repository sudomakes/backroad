import { ComponentPropsMapping } from "@backroad/core";

export const Button = (props:ComponentPropsMapping["button"])=>{
    return <button className="btn">{props.args.label}</button>
}