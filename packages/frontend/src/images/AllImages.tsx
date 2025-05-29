import {type IImageData} from "../MockAppData.ts";
import { ImageGrid } from "./ImageGrid.tsx";

interface IAllImagesProps {
    imageData: IImageData[];
}

export function AllImages(props: IAllImagesProps) {
    return (
        <div>
            <h2>All Images</h2>
            <ImageGrid images={props.imageData} />
        </div>
    );
}
