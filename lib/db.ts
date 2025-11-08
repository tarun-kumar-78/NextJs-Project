import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI! as string;

if (!MONGODB_URI) throw new Error("Define mongodb_uri in env file");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn; // return conn if exist
  }
  if (!cached.conn) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };
    mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}
