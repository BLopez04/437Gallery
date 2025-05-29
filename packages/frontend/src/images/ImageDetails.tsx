import {useParams} from "react-router";
import type {IImageData} from "../MockAppData.ts";

interface IImageDetailsProps {
    imageData: IImageData[];
}

export function ImageDetails(props: IImageDetailsProps) {
    /* _setImageData */
    const { imageId } = useParams();

    const image = props.imageData.find(image => image.id === imageId);

    if (!image) {
        return <div><h2>Image not found</h2></div>;
    }


    return (
        <div>
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </div>
    )
}
