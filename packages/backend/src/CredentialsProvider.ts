import {Collection, MongoClient} from "mongodb";
import bcrypt from "bcrypt";

interface ICredentialsDocument {
    username: string;
    password: string;
}

export class CredentialsProvider {
    private readonly collection: Collection<ICredentialsDocument>;

    constructor(mongoClient: MongoClient) {
        const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
        if (!COLLECTION_NAME) {
            throw new Error("Missing CREDS_COLLECTION_NAME from env file");
        }
        this.collection = mongoClient.db().collection<ICredentialsDocument>(COLLECTION_NAME);
    }

    async registerUser(username: string, plaintextPassword: string) {
        const existing = await this.collection.findOne({ username });

        if (existing) {
            return false;
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(plaintextPassword, salt);

        await this.collection.insertOne({
            username,
            password: hashedPass
        })
        console.log(salt, hashedPass)
        return true;
    }

    async verifyPassword(username: string, plaintextPassword: string) {
        const existing = await this.collection.findOne({ username });

        if (!existing) {
            return false
        }

        return await bcrypt.compare(plaintextPassword, existing.password);
    }

}
