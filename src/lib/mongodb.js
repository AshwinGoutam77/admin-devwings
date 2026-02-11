import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!(global)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global)._mongoClientPromise = client.connect();
    console.log("✅ MongoDB connected successfully! innrer");
  }
  clientPromise = (global)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
      console.log("✅ MongoDB connected successfully! outer");

}

export default clientPromise;
