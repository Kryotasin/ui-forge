// src/lib/mongodb.ts
import { MongoClient, ServerApiVersion } from 'mongodb';

// Check for required environment variables
if (!process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
    throw new Error('Please add your MongoDB username and password to .env.local');
}

// Construct the MongoDB URI with credentials from environment variables
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.jio8mfu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// MongoDB client options
const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!(global as any)._mongoClientPromise) {
        client = new MongoClient(uri, options);
        (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;