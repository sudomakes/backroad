import { useCallback, useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { setBackroadValue } from '../socket';
import { BackroadComponentRenderer } from '../types/components';


// Improved version of https://usehooks.com/useOnClickOutside/
const useClickOutside = (ref: React.RefObject<HTMLDivElement>
    , handler: (...args: any) => void) => {
    useEffect(() => {
        let startedInside: boolean | null = false;
        let startedWhenMounted: false | HTMLDivElement | null = false;

        const listener = (event: { target: any }) => {
            // Do nothing if `mousedown` or `touchstart` started inside ref element
            if (startedInside || !startedWhenMounted) return;
            // Do nothing if clicking ref's element or descendent elements
            if (!ref.current || ref.current.contains(event.target)) return;

            handler(event);
        };

        const validateEventStart = (event: { target: any }) => {
            startedWhenMounted = ref.current;
            startedInside = ref.current && event.target && ref.current.contains(event.target as Node);
        };

        document.addEventListener("mousedown",
            validateEventStart
        );
        document.addEventListener("touchstart", validateEventStart);
        document.addEventListener("click", listener);

        return () => {
            document.removeEventListener("mousedown", validateEventStart);
            document.removeEventListener("touchstart", validateEventStart);
            document.removeEventListener("click", listener);
        };
    }, [ref, handler]);
};

export const ColorPicker: BackroadComponentRenderer<"color_picker"> = (props) => {
    const popover = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState(props.value || undefined);
    const [isOpen, setIsOpen] = useState(false);

    const close = useCallback(() => setIsOpen(false), []);
    useClickOutside(popover, close);
    return <div className="form-control w-full max-w-xs relative">
        <label className="label">
            <span className="backroad-label">{props.args.label || 'Pick a color'}</span>
        </label>
        <div className='h-8 w-8 rounded-md cursor-pointer' style={{ backgroundColor: value }} onClick={() => {
            if (!isOpen) { setIsOpen(true) }
        }}></div>
        {isOpen && <div ref={popover} className='absolute top-[80px]'>

            <HexColorPicker color={value} onChange={(newColor) => {
                setValue(newColor)
                setBackroadValue({ id: props.id, value: newColor })
            }} />
        </div>}
    </div>
};
