import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add MONGODB_URI to your .env file");
}

if (process.env.NODE_ENV === "development") {
  // Reuse client in dev to avoid hot-reload problems
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // New client for production
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
