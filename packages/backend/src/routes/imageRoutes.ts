import express, {Request, Response} from "express";
import { ImageProvider } from "../ImageProvider";
import {mongoClient, waitDuration} from "../index";
import {ObjectId} from "mongodb";

export function registerImageRoutes(app: express.Application, imageProvider: ImageProvider) {

    app.get("/api/images", async (req: Request, res: Response) => {
        try {
            await waitDuration(1000);
            const paramValue = req.query.contains;

            const images = await imageProvider.getAllImages(paramValue as string)

            const userMap = new Map();
            const users = await mongoClient.db().collection("users").find().toArray();
            users.forEach(user => {
                userMap.set(user._id.toString(),
                    { id: user._id.toString(), username: user.username })
            })
            const normalized = images.map(image => ( {
                id: image._id.toString(),
                src: image.src,
                name: image.name,
                author: userMap.get(image.authorId) || { id: image.authorId.toString(), username: "Unknown"}
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
            const name = req.body.name;
            if (!ObjectId.isValid(id)) {
                res.status(404).send(
                    {   error: "Not Found",
                        message: "Image Does Not Exist"
                    })
            }
            if (name.length > MAX_NAME_LENGTH) {
                res.status(422).send({
                    error: "Unprocessable Entity",
                    message: `Image name exceeds ${MAX_NAME_LENGTH} characters`
                });
            }
            imageProvider.updateImageName(id, name)
                .then(ret => {
                    if (ret === 0) {
                        res.status(400).send({
                            error: "Bad Request",
                            message: "Request may not have fit format"
                        });
                    }
                    res.status(204).send()
                })
                .catch(() =>
                res.status(404).send("Failed to find resource"))
        }
        catch(err) {
            res.status(500).send("Failed to update image name")
        }
    });

}