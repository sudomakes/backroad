import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { BackroadComponentRenderer } from "../types/components";

export const ChatInput: BackroadComponentRenderer<"chat_input"> = (props) => {
    return <div className="border-base-200">
        <div contentEditable className="flex-1"></div>
        <PaperAirplaneIcon />
    </div>
}