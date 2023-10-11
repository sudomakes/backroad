import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
// import { useState } from "react";
import { setRunUnsetBackroadValue } from "../../socket";
import { BackroadComponentRenderer } from "../../types/components";
// [contenteditable=true]:empty:before{
//     content: attr(placeholder);
//     pointer-events: none;
//     display: block; /* For Firefox */
//   }
export const ChatInput: BackroadComponentRenderer<"chat_input"> = (props) => {
    // const [value, setValue] = useState(props.value)
    const handleValueSubmission = (value: string | null) => {
        setRunUnsetBackroadValue({ id: props.id, value: value })
    }
    return <div className={`border-base-300 border p-2 rounded-lg flex items-start bg-base-200`}>
        <textarea
            // value={value || ""} onChange={(e) => setValue(e.target.value || "")} 
            onKeyUp={(e) => {
                if (e.key === "Enter") {
                    handleValueSubmission(e.currentTarget.value)
                    e.currentTarget.blur()
                }
            }} placeholder={props.args.placeholder} className={`flex-1 bg-transparent focus:outline-none`} />
        <PaperAirplaneIcon width={20} onClick={() => {
            // handleValueSubmission(value)
        }} />
    </div>
}