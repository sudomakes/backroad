import { useMemo } from "react";
import { BackroadComponentRenderer } from "../types/components"
import { useDropzone } from 'react-dropzone';
import { sessionId, setBackroadValue } from "../socket";

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    cursor: "pointer",
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

export const FileUpload: BackroadComponentRenderer<"file_upload"> = (props) => {
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject, acceptedFiles,
    } = useDropzone({
        accept: { 'image/*': [] }, async onDrop(files, event) {
            const data = new FormData();
            files.forEach(file => {

                data.append('files', file);
            })
            data.append('sessionId', sessionId);
            data.append('id', props.id);
            const resp = await (await fetch("/api/uploads", { method: "POST", body: data })).json()
            console.log("upload response", resp)
            setBackroadValue({ id: props.id, value: resp })
        },
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

    return (
        <div className="container">
            <div {...getRootProps({ style: style })}>
                <input {...getInputProps()} />
                <p>{acceptedFiles.length ? `${acceptedFiles.length} file(s) selected` : "Drag 'n' drop some files here, or click to select files"} </p>
            </div>
        </div>
    );
}

