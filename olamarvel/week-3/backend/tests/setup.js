"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let mongo;
beforeAll(async () => {
    /*mongo = await MongoMemoryServer.create();
      
    const uri = mongo.getUri();
      console.log(uri)
      */
    if (!process.env.DB_URI) {
        throw new Error("DB_URI is not defined in environment variables");
    }
    await mongoose_1.default.connect(process.env.DB_URI);
    //await mongoose.connect(uri);
    console.log("success");
}, 30000); // increase timeout
afterAll(async () => {
    await mongoose_1.default.connection.dropDatabase();
    await mongoose_1.default.connection.close();
    //await mongo.stop();
});
afterEach(async () => {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});
