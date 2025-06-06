import { Request, Response, NextFunction } from "express";
import multer from "multer";

class ImageFormatError extends Error {}

const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = process.env.IMAGE_UPLOAD_DIR || "uploads"
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        const mimeType = file.mimetype;
        let fileExtension;
        if ((mimeType) === "image/png") {
            fileExtension = ".png"
        }
        else if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
            fileExtension = ".jpg"
        }
        else {
            return cb(new Error("Image type not supported"), "")
        }

        const fileName = Date.now() + "-" + Math.round(Math.random() * 1E9) + "." + fileExtension;
        cb(null, fileName)
    }
});

export const imageMiddlewareFactory = multer({
    storage: storageEngine,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
});

export function handleImageFileErrors(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
        res.status(400).send({
            error: "Bad Request",
            message: err.message
        });
        return;
    }
    next(err); // Some other error, let the next middleware handle it
}