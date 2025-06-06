import {Route, Routes, useNavigate} from "react-router";
import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import {MainLayout} from "./MainLayout.tsx";
import {useRef, useState} from "react";
import { ValidRoutes } from "csc437-monorepo-backend/src/common/ValidRoutes.ts";
import type {IApiImageData} from "../../backend/src/common/ApiImageData.ts";
import {ImageSearchForm} from "./images/ImageSearchForm.tsx";
import {ProtectedRoute} from "./ProtectedRoute.tsx";

function App() {
    const [imageData, setImageData] = useState<IApiImageData[]>([]);
    const [fetchState, setFetchState] = useState(true);
    const [errorState, setErrorState] = useState(false);
    const [searchContents, setSearchContents] = useState("");
    const [authToken, setAuthToken] = useState<string>("");
    const nav = useNavigate();
    const ref = useRef(0);

    function changeToken(token: string) {
        setAuthToken(token);
        fetchImages(token, "/api/images");
        nav('/')
    }

    async function fetchImages(token: string, search: string) {
        const newRef = ref.current + 1;
        ref.current = newRef;

        setFetchState(true);
        try {
            const res = await fetch(search, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (res.status >= 400) {
                throw new Error(`HTTP error: ${res.status}`)
            }

            const data = await res.json()

            if (ref.current == newRef) {
                setImageData(data);
                setFetchState(false);
                setErrorState(false);
            }
        }

        catch(err) {
            console.log(`Error is ${err}`);
            if (ref.current == newRef) {
                setFetchState(false);
                setErrorState(true);
            }
        }
    }


    function handleImageSearch() {
        let searchStr = `/api/images`

        if (searchContents) {
            searchStr = `${searchStr}?contains=${searchContents}`
        }
        fetchImages(authToken, searchStr)
    }

    async function imageEdit(id: string, newName: string) {
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
                    <Route index element={
                        <ProtectedRoute authToken={authToken}>
                            <AllImages imageData={imageData}
                                       fetchState={fetchState} errorState={errorState}
                                       searchPanel={<ImageSearchForm searchString={searchContents} onSearchRequested={handleImageSearch}
                                                                     onSearchStringChange={handleSearchChange}/>}/>
                        </ProtectedRoute>
                    }/>
                    <Route path={`${ValidRoutes.IMAGES}/:imageId`} element={
                        <ProtectedRoute authToken={authToken}>
                            <ImageDetails imageData={imageData} fetchState={fetchState} errorState={errorState}
                            imageEdit={imageEdit}
                            authToken={authToken}/>
                        </ProtectedRoute>
                    }/>
                    <Route path={ValidRoutes.UPLOAD} element={
                        <ProtectedRoute authToken={authToken}>
                            <UploadPage authToken={authToken}/>
                        </ProtectedRoute>}/>
                    <Route path={ValidRoutes.LOGIN} element={
                            <LoginPage isRegistering={false}
                                       changeToken={changeToken}/>}/>
                    <Route path={ValidRoutes.REGISTER} element={
                            <LoginPage isRegistering={true}
                                       changeToken={changeToken}/>}/>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
