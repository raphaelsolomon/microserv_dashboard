import mongoose from "mongoose";
import "dotenv/config";

export default class Database {
  constructor() {
    mongoose.Promise = global.Promise;
    mongoose.set("strictQuery", true);
  }

  public async connectToMongoDB(): Promise<typeof mongoose | Error> {
    try {
      return await mongoose.connect(process.env.MONGO_URL, {
        dbName: process.env.MONGO_DATABASE_NAME,
      });
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  public async closeMongoDBConnection() {
    try {
      await mongoose.connection.close();
    } catch (e) {
      console.log(e);
    }
  }

  public async clearDatabase() {
    try {
      await mongoose.connection.db.dropDatabase();
    } catch (e) {
      console.log(e);
    }
  }

  public async clearDatabaseTable(tableName: string) {
    try {
      await mongoose.connection.db.dropCollection(tableName);
    } catch (e) {
      console.log(e);
    }
  }

  get mongoose(): typeof mongoose {
    return this.mongoose;
  }
}
