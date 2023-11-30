const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
const { MONGODB_URI} = require("./config");

const connectDB = async () => {
  console.log("Connecting to Mongo");
  try {
    let connection = await mongoose.connect(MONGODB_URI, {
      dbName: "wordai",
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("Connected to Mongo");
  } catch (error) {
    console.log("Connection error: " + error?.message);
  }
};

const connectDBT = async () => {
  const uri =
    "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.1";

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
};

module.exports = connectDB;
