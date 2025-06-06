import {useParams} from "react-router";
import type {IApiImageData} from "../../../backend/src/common/ApiImageData.ts";
import {ImageNameEditor} from "./ImageNameEditor.tsx";

interface IImageDetailsProps {
    imageData: IApiImageData[];
    fetchState: boolean;
    errorState: boolean;
    imageEdit: (id: string, newName: string) => void;
    authToken: string;
}

export function ImageDetails(props: IImageDetailsProps) {
    /* _setImageData */
    const { imageId } = useParams();

    const image = props.imageData.find(image => image.id === imageId);
    if (!image) {
        return <div>{props.fetchState ? <h2> Loading... </h2> : ""}</div>;
    }
    if (props.errorState) {
        return <div><h2>Image not found</h2></div>;
    }

    return (
        <div>
            <h2>{image.name}</h2>
            <p>By {image.authorId}</p>
            <ImageNameEditor initialValue={image.name} imageId={image.id}
            imageEdit={props.imageEdit} authToken={props.authToken}/>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </div>
    )
}
