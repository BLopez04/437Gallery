import {useState} from "react";

interface INameEditorProps {
    initialValue: string;
    imageId: string;
    imageEdit: (id: string, newName: string) => void;
    authToken: string
}

export function ImageNameEditor(props: INameEditorProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [input, setInput] = useState(props.initialValue);
    const [disabled, setDisabled] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const [editError, setEditError] = useState(false);

    async function handleSubmitPressed() {
        try {
            const res = await fetch(`/api/images/${props.imageId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${props.authToken}`
                },
                body: JSON.stringify({ name: input })
            })

            if (res.status >= 400) {
                throw new Error(`HTTP error: ${res.status}`)
            }

            setInProgress(false);
            setEditError(false);
            setDisabled(false);
            setIsEditingName(false);
            props.imageEdit(props.imageId, input)
        }

        catch(err) {
            console.log(`Error is ${err}`);
            setInProgress(false)
            setEditError(true)
        }
    }

    if (isEditingName) {
        return (
            <div style={{ margin: "1em 0" }}>
                <label>
                    New Name <input value={input} disabled={disabled} onChange={e => {
                    setInput(e.target.value);
                    setEditError(false);
                }}/>
                </label>
                <button disabled={input.length === 0 || disabled} onClick={handleSubmitPressed}>Submit</button>
                <button onClick={() => setIsEditingName(false)}>Cancel</button> {inProgress ? "Working...": ""}
                {editError ? "Error: Could not update name - Make sure you're the owner!": ""}
            </div>
        );
    } else {
        return (
            <div style={{ margin: "1em 0" }}>
                <button onClick={() => setIsEditingName(true)}>Edit name</button>
            </div>
        );
    }
}