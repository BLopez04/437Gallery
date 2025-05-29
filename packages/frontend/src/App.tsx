import {Route, Routes } from "react-router";
import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import {MainLayout} from "./MainLayout.tsx";
import {useState} from "react";
import {fetchDataFromServer} from "./MockAppData.ts";

function App() {
    /* _setImageData */
    const [imageData] = useState(fetchDataFromServer);

    return (
        <div>
            <Routes>
                <Route path="/" element={<MainLayout/>}>
                    <Route index element={<AllImages imageData={imageData}/>}/>
                    <Route path="/images/:imageId" element={<ImageDetails imageData={imageData}/>}/>
                    <Route path="/upload" element={<UploadPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
