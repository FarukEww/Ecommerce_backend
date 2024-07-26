import { Secret } from "jsonwebtoken";
// import { Secret } from "cloudinary";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGO_URI: string;
      JWT_SECRET_USER: Secret;
      JWT_SECRET_ADMIN: Secret;
      CLOUD_NAME: string;
      API_KEY: string;
      API_SECRET: string;
    }
  }
}
export {};
