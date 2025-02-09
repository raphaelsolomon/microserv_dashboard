import mongoose from "mongoose";
import "dotenv/config";
export default class Database {
    constructor();
    connectToMongoDB(): Promise<typeof mongoose | Error>;
    closeMongoDBConnection(): Promise<void>;
    clearDatabase(): Promise<void>;
    clearDatabaseTable(tableName: string): Promise<void>;
    get mongoose(): typeof mongoose;
}
