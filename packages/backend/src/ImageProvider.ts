import {Collection, MongoClient, ObjectId} from "mongodb";

interface IImageDocument {
    src: string;
    name: string;
    authorId: string;
}

export class ImageProvider {
    private collection: Collection<IImageDocument>

    constructor(private readonly mongoClient: MongoClient) {
        const collectionName = process.env.IMAGES_COLLECTION_NAME;
        if (!collectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }
        this.collection = this.mongoClient.db().collection(collectionName);
    }

    getAllImages(substring : string | undefined) {
        if (substring) {
            console.log(`/${substring}/`)
            return this.collection.find({name : {$regex: substring}}).toArray()
        }
        return this.collection.find().toArray(); // Without any options, will by default get all documents in the collection as an array.
    }

    async verifiedOwner(imageId: string, username: string | undefined): Promise<boolean> {
        const img = await this.collection.findOne({_id : new ObjectId(imageId)})
        return img?.authorId === username
    }

    async updateImageName(imageId: string, newName: string): Promise<number> {

        return this
            .collection.updateOne({_id : new ObjectId(imageId)}, {$set: {name: newName}})
            .then(res => res.matchedCount)
    }

    async createImage(src: string, name: string, authorId: string) {
        const res = await this.collection.insertOne({src, name, authorId})
        return res.insertedId
    }
}