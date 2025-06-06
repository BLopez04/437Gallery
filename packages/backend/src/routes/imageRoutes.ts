import express, {Request, Response} from "express";
import { ImageProvider } from "../ImageProvider";
import {waitDuration} from "../index";
import {ObjectId} from "mongodb";
import {imageMiddlewareFactory, handleImageFileErrors} from "../imageUploadMiddleware";

export function registerImageRoutes(app: express.Application, imageProvider: ImageProvider) {

    app.get("/api/images", async (req: Request, res: Response) => {
        try {
            await waitDuration(1000);

            const paramValue = req.query.contains;

            const images = await imageProvider.getAllImages(paramValue as string)

            const normalized = images.map(image => ( {
                id: image._id.toString(),
                src: image.src,
                name: image.name,
                authorId: image.authorId
            }))

            console.log(normalized)
            res.send(normalized)
        }
        catch(err) {
            res.status(500).send("Failed to fetch images")
        }
    });

    app.put("/api/images/:imageId", async (req: Request, res: Response) => {
        try {
            const MAX_NAME_LENGTH = 100;
            const id = req.params.imageId;
            const newName = req.body.name;
            const username = req.user?.username;

            if (!ObjectId.isValid(id)) {
                res.status(404).send(
                    {   error: "Not Found",
                        message: "Image Does Not Exist"
                    })
                return;
            }

            const owner = await imageProvider.verifiedOwner(id, username)
            if (!owner) {
                res.status(403).send(
                    {   error: "Forbidden",
                        message: "You do not have permission to edit this image"
                    }
                )
                return;
            }

            if (newName.length > MAX_NAME_LENGTH) {
                res.status(422).send({
                    error: "Unprocessable Entity",
                    message: `Image name exceeds ${MAX_NAME_LENGTH} characters`
                });
                return;
            }

            const updated = await imageProvider.updateImageName(id, newName);

            if (updated === 0) {
                res.status(404).send({
                    error: "Not Found",
                    message: "Failed to find resource"
                });
                return;
            }
            res.status(204).send()
        }
        catch(err) {
            res.status(500).send("Failed to update image name")
        }
    });

    app.post("/api/images",
        imageMiddlewareFactory.single("image"),
        handleImageFileErrors,
        async (req: Request, res: Response) => {
            try {
                if (!req.file || !req.file.filename) {
                    res.status(400).send({
                        error: "Bad Request",
                        message: "Image file or filename missing"
                    })
                    return;
                }

                const username = req.user?.username || "Anonymous";

                const resultId = await imageProvider.createImage(`/uploads/${req.file.filename}`,
                    req.body.name, username)

                if (!resultId) {
                    res.status(500).send("Error on image upload")
                    return;
                }

                res.status(201).send();

            }
            catch (err) {
                res.status(500).send("Server error on upload");
            }
        }
    );

}