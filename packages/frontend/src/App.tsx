import {Route, Routes } from "react-router";
import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import {MainLayout} from "./MainLayout.tsx";
import {useEffect, useRef, useState} from "react";
import { ValidRoutes } from "csc437-monorepo-backend/src/common/ValidRoutes.ts";
import type {IApiImageData} from "../../backend/src/common/ApiImageData.ts";
import {ImageSearchForm} from "./images/ImageSearchForm.tsx";

function App() {
    const [imageData, setImageData] = useState<IApiImageData[]>([]);
    const [fetchState, setFetchState] = useState(true);
    const [errorState, setErrorState] = useState(false);
    const [searchContents, setSearchContents] = useState("");
    const ref = useRef(0);

    function fetchImages(search: string) {
        const newRef = ref.current + 1;
        ref.current = newRef;

        setFetchState(true);
        fetch(search)
            .then(res => {
                if (res.status >= 400) {
                    throw new Error(`HTTP error: ${res.status}`)
                }
                return res.json()
            })
            .then(data => {
                if (ref.current == newRef)
                {
                    setImageData(data);
                    setFetchState(false);
                    setErrorState(false);
                }
            })
            .catch(err => {
                console.log(`Error is ${err}`);
                if (ref.current == newRef) {
                    setFetchState(false);
                    setErrorState(true);
                }
            })
    }

    useEffect(() => {
        fetchImages("/api/images")
    }, []);


    function handleImageSearch() {
        let searchStr = `/api/images`

        if (searchContents) {
            searchStr = `${searchStr}?contains=${searchContents}`
        }
        fetchImages(searchStr)
    }

    function imageEdit(id: string, newName: string) {
        const newImages = imageData.map(image => image.id === id ? {...image, name: newName} : image)
        setImageData(newImages)
    }

    function handleSearchChange(str: string) {
        setSearchContents(str)
    }

    return (
        <div>
            <Routes>
                <Route path={ValidRoutes.HOME} element={<MainLayout/>}>
                    <Route index element={<AllImages imageData={imageData}
                    fetchState={fetchState} errorState={errorState}
                    searchPanel={<ImageSearchForm searchString={searchContents} onSearchRequested={handleImageSearch}
                    onSearchStringChange={handleSearchChange}/>}/>}/>
                    <Route path={`${ValidRoutes.IMAGES}/:imageId`} element={<ImageDetails
                        imageData={imageData} fetchState={fetchState} errorState={errorState}
                    imageEdit={imageEdit}/>}/>
                    <Route path={ValidRoutes.UPLOAD} element={<UploadPage/>}/>
                    <Route path={ValidRoutes.LOGIN} element={<LoginPage/>}/>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
