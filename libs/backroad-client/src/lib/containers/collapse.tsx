import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { BackroadContainerRenderer } from "../types/containers";

import {
    AccordionItem,
    AccordionItemButton,
    AccordionItemHeading,
    AccordionItemPanel,
    AccordionItemState,
    Accordion as ReactAccordion
} from 'react-accessible-accordion';
import { Base } from "./base";
export const Collapse: BackroadContainerRenderer<"collapse"> = (props) => {
    return <ReactAccordion allowZeroExpanded >
        <AccordionItem className="border border-base-300 p-4 rounded-lg">


            <AccordionItemHeading className="">
                <AccordionItemButton>
                    <AccordionItemState >
                        {({ expanded }) => <div className="flex justify-between items-center">
                            <div className="flex-1">

                                {props.args.label}
                            </div>
                            {expanded ? <ChevronUpIcon width={20} /> : <ChevronDownIcon width={20} />}
                        </div>

                        }
                    </AccordionItemState>
                </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="mt-4">
                <Base {...{ ...props, type: "base" }} />
            </AccordionItemPanel>
        </AccordionItem>
    </ReactAccordion>
}