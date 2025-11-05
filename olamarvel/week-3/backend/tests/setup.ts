import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
dotenv.config();


let mongo

beforeAll(async () => {
  /*mongo = await MongoMemoryServer.create();
	
  const uri = mongo.getUri();
	console.log(uri)
	*/
	if(!process.env.DB_URI){
        throw new Error("DB_URI is not defined in environment variables");
    }
   await mongoose.connect(process.env.DB_URI)
  //await mongoose.connect(uri);
	console.log("success")
}, 30000); // increase timeout

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  //await mongo.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
