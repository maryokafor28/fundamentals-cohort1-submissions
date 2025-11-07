import dotenv from "dotenv";

dotenv.config();
export const PORT = process.env.PORT || 4000;
export const CART_SERVICE_URL = process.env.CART_SERVICE_URL;
export const FAKESTORE_API_URL = process.env.FAKESTORE_API_URL;
