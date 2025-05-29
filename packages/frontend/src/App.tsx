import {Route, Routes } from "react-router";
import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import {MainLayout} from "./MainLayout.tsx";
import {useState} from "react";
import {fetchDataFromServer} from "./MockAppData.ts";
import { ValidRoutes } from "csc437-monorepo-backend/src/shared/ValidRoutes.ts";

function App() {
    /* _setImageData */
    const [imageData] = useState(fetchDataFromServer);

    return (
        <div>
            <Routes>
                <Route path={ValidRoutes.HOME} element={<MainLayout/>}>
                    <Route index element={<AllImages imageData={imageData}/>}/>
                    <Route path={ValidRoutes.IMAGES} element={<ImageDetails imageData={imageData}/>}/>
                    <Route path={ValidRoutes.UPLOAD} element={<UploadPage/>}/>
                    <Route path={ValidRoutes.LOGIN} element={<LoginPage/>}/>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
