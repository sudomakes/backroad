import { ComponentPropsMapping } from "@backroad/core";

export const NumberInput = (props:ComponentPropsMapping["number_input"])=>{
 return <div className="form-control w-full max-w-xs">
 <label className="label">
   <span className="label-text">{props.args.label}</span>
 </label>
 <input type="number" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
</div>
}