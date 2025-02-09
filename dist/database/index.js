"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
class Database {
    constructor() {
        mongoose_1.default.Promise = global.Promise;
        mongoose_1.default.set("strictQuery", true);
    }
    async connectToMongoDB() {
        try {
            return await mongoose_1.default.connect(process.env.MONGO_URL, {
                dbName: process.env.MONGO_DATABASE_NAME,
            });
        }
        catch (e) {
            console.log(e);
            return e;
        }
    }
    async closeMongoDBConnection() {
        try {
            await mongoose_1.default.connection.close();
        }
        catch (e) {
            console.log(e);
        }
    }
    async clearDatabase() {
        try {
            await mongoose_1.default.connection.db.dropDatabase();
        }
        catch (e) {
            console.log(e);
        }
    }
    async clearDatabaseTable(tableName) {
        try {
            await mongoose_1.default.connection.db.dropCollection(tableName);
        }
        catch (e) {
            console.log(e);
        }
    }
    get mongoose() {
        return this.mongoose;
    }
}
exports.default = Database;
//# sourceMappingURL=index.js.map