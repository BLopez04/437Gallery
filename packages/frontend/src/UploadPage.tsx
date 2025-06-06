import {useActionState, useId, useState} from "react";

function readAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = () => resolve(fr.result as string);
        fr.onerror = (err) => reject(err);
    });
}

interface IUploadPageProps {
    authToken: string
}

export function UploadPage(props: IUploadPageProps) {
    const fileId = useId()
    const [previewSrc, setPreviewSrc] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    async function handleFileSelected(e: { target: any; }) {
        const inputElement = e.target;
        const fileObj = inputElement.files[0];
        if (fileObj) {
            try {
                const url = await readAsDataURL(fileObj)
                setPreviewSrc(url)
                setSelectedFile(fileObj)
            }
            catch (err) {
                console.error("Error reading in file:", err)
            }
        }
    }

    async function uploadRequest(formData:  FormData){
        const res = await fetch("/api/images", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${props.authToken}`
            },
            body: formData
        })

        if (!res.ok) {
            const errBody = await res.json()
            throw new Error(`${res.status} ${errBody.error}: ${errBody.message}`)
        }
        return res.text()

    }

    const [result, submitAction, isPending] = useActionState(
        async (_previousState: { type: string; message: string } | null, formData: FormData) => {
            if (!selectedFile || !formData.get("name")) {
                return {
                    type: "error",
                    message: "Please select a file or set a name",
                };
            }
            try {
                const res = await uploadRequest(formData)
                return {
                    type: "success",
                    message: `Successful upload ${res}`
                }
            }
            catch (err) {
                console.error("Error", err)
                const errMsg = err as Error;
                return {
                    type: "error",
                    message: errMsg.message
                }
            }
        },
        null
    );

    return (
        <div>
            <h2>Upload</h2>
            <form action={submitAction}>
                <div>
                    <label htmlFor={fileId}>Choose image to upload: </label>
                    <input
                        id={fileId}
                        name="image"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        multiple={false}
                        required
                        onChange={handleFileSelected}
                        disabled={isPending}
                    />
                </div>
                <div>
                    <label>
                        <span>Image title: </span>
                        <input name="name" required disabled={isPending}/>
                    </label>
                </div>

                <div>
                    {previewSrc ?
                        <img style={{width: "20em", maxWidth: "100%"}} src={previewSrc} alt=""/>
                        : ""}
                </div>

                <input type="submit" disabled={isPending} value="Confirm upload"/>

                {result?.type === "error" ?
                    <div id="announce" className="error" aria-live="polite">
                        {result.message}
                    </div> : ""}
            </form>
        </div>
    );
}
