import {type IApiImageData} from "../../../backend/src/common/ApiImageData.ts";
import { ImageGrid } from "./ImageGrid.tsx";

interface IAllImagesProps {
    imageData: IApiImageData[];
    fetchState: boolean;
    errorState: boolean;
    searchPanel: React.ReactNode;
}

export function AllImages(props: IAllImagesProps) {
    return (
        <div>
            {props.searchPanel}
            <h2>All Images</h2>
            {props.fetchState ? <h2> Loading... </h2> : ""}
            {props.errorState ? <h2> Error: Could not fetch images </h2> : ""}
            <ImageGrid images={props.imageData} />
        </div>
    );
}
