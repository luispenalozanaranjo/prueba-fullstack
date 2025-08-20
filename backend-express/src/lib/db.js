import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export async function connectDB(){
  const uri = process.env.MONGODB_URI;
  if(!uri) throw new Error("MONGODB_URI required");
  await mongoose.connect(uri, { dbName: "prueba_fullstack" });
  console.log("[DB] conectado");
}
