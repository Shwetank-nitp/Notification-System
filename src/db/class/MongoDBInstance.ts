import mongoose, { Mongoose } from 'mongoose';

export default class MongoDBInstance {
  private static mongoose: Mongoose | null = null;

  private constructor() {}

  public static get instance(): Mongoose | null {
    return MongoDBInstance.mongoose;
  }

  public static async connect(connectionString: string): Promise<Mongoose> {
    if (MongoDBInstance.instance) {
      return MongoDBInstance.instance;
    }

    MongoDBInstance.mongoose = await mongoose.connect(connectionString, {
      retryWrites: true,
    });
    return MongoDBInstance.mongoose;
  }
}
