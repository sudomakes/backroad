import { useEffect, useMemo } from "react";
import { BackroadComponentRenderer } from "../types/components"
import { useDropzone } from 'react-dropzone';
import { sessionId, setBackroadValue } from "../socket";
import { ClipboardDocumentIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { minimatch } from 'minimatch'

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    maxWidth: 600,
    borderColor: 'hsl(var(--nc))',
    borderStyle: 'dashed',
    backgroundColor: 'hsl(var(--n))',
    color: 'hsl(var(--nc))',
    outline: 'none',
    cursor: "pointer",
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: 'hsl(var(--p))',
    color: 'hsl(var(--p))'
};

const acceptStyle = {
    color: 'hsl(var(--suc))',
    borderColor: 'hsl(var(--suc))'
};

const rejectStyle = {
    color: 'hsl(var(--er))',
    borderColor: 'hsl(var(--er))'
};

export const FileUpload: BackroadComponentRenderer<"file_upload"> = (props) => {
    const handleFiles = async (files: Blob[] | File[]) => {
        const data = new FormData();
        files.forEach(file => {

            data.append('files', file);
        })
        data.append('sessionId', sessionId);
        data.append('id', props.id);
        const resp = await (await fetch("/api/uploads", { method: "POST", body: data })).json()
        console.log("upload response", resp)
        setBackroadValue({ id: props.id, value: resp })
    }
    const acceptObject = props.args.accept || { "image/*": [] }
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject, acceptedFiles,
    } = useDropzone({

        ...props.args, onDrop: handleFiles, accept: acceptObject
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    const handlePaste = async () => {
        // if (!navigator.clipboard) {
        //     console.log('Clipboard API not available');
        //     return;
        // }
        const files: Blob[] = [];

        try {
            const items = await navigator.clipboard.read();
            // console.log("clipboard items", items)
            // for (let i = 0; i < items.length; i++) {
            //     const item = items[i];
            //     // if (item. === 'file') {
            //     //     const blob = item.getAsFile();
            //     //     if (blob) files.push(blob);
            //     //     console.log('Pasted file:', blob);
            //     // }
            //     files.push(await item.getAs())
            // }
            for (const clipboardItem of items) {
                for (const type of clipboardItem.types) {
                    if (Object.keys(acceptObject).some((pattern) => minimatch(type, pattern))) {
                        const blob = await clipboardItem.getType(type);
                        files.push(blob);
                    }
                }
            }
            handleFiles(files)
        } catch (err) {
            console.log('Failed to read clipboard contents: ', err);
        }
    };

    // const { getRootProps, getInputProps, isDragActive } = useDropzone();

    useEffect(() => {
        document.addEventListener('paste', handlePaste);
        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, []);

    return (
        <div>
            <label className="label">
                <span className="backroad-label">{props.args.label}</span>
            </label>

            <div {...getRootProps({ style: style })}>
                <input {...getInputProps()} />
                <div className="flex gap-4 items-center w-full">
                    <div className="flex-1 flex gap-4 items-center">
                        <CloudArrowUpIcon width={40} />
                        <p>{acceptedFiles.length ? props.args.multiple ? `${acceptedFiles.length} file(s) selected` : `${acceptedFiles[0].name} selected` : "Drag 'n' drop some files here, or click to select files"} </p>
                    </div>
                    <div className="btn btn-primary">Upload Files</div>
                    <div>

                        <ClipboardDocumentIcon width={40} onClick={(e) => {
                            handlePaste()
                            e.stopPropagation()
                        }} />
                    </div>
                </div>
            </div>
            {/* <button className="cursor-pointer btn btn-primary" >
                hi
            </button> */}


        </div >
    );
}

