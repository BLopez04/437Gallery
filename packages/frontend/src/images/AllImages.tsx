import {type IApiImageData} from "../../../backend/src/common/ApiImageData.ts";
import { ImageGrid } from "./ImageGrid.tsx";

interface IAllImagesProps {
    imageData: IApiImageData[];
    fetchState: boolean;
    errorState: boolean;
}

export function AllImages(props: IAllImagesProps) {
    return (
        <div>
            <h2>All Images</h2>
            <ImageGrid images={props.imageData} />
            {props.fetchState ? <h2> Loading... </h2> : ""}
            {props.errorState ? <h2> Error: Could not fetch images </h2> : ""}
        </div>
    );
}
