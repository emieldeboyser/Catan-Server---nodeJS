const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { json } = require("express");
const dotenv = require("dotenv");
dotenv.config();

// Import the cors package
const cors = require("cors");

const app = express();
const port = 3001;

const corsOptions = {
  origin: "*", // This allows all origins to access the API
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to the MongoDB client
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Connection error:", error);
  }
}

// Run the connection function
run().catch(console.dir);

// Define the route to fetch scores
app.get("/api/scores", async (req, res) => {
  try {
    const dbo = client.db("scores");
    const scores = await dbo
      .collection("scores")
      .find({})
      .sort({ date: -1 })
      .toArray();
    res.send(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).send("Error fetching scores");
  }
});

app.get("/api/scores/:id", async (req, res) => {
  try {
    const dbo = client.db("scores");
    const scoreId = new ObjectId(req.params.id);
    const score = await dbo.collection("scores").findOne({ _id: scoreId });

    if (!score) {
      console.log("Document not found with ID:", req.params.id);
      return res.status(404).send("Document not found");
    }

    res.send(score);
  } catch (error) {
    console.error("Error fetching score:", error);
    res.status(500).send("Error fetching score");
  }
});

app.post("/api/scores", async (req, res) => {
  try {
    const dbo = client.db("scores");
    const scores = await dbo.collection("scores").insertOne(req.body);
    res.send(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).send("Error fetching scores");
  }
});

app.delete("/api/scores/:id", async (req, res) => {
  try {
    const dbo = client.db("scores");
    const scoreId = new ObjectId(req.params.id);
    const result = await dbo.collection("scores").deleteOne({ _id: scoreId });

    if (result.deletedCount === 0) {
      console.log("Document not found with ID:", req.params.id);
      return res.status(404).send("Document not found");
    }

    console.log("Deleted document with ID:", req.params.id);
    res.send(result);
  } catch (error) {
    console.error("Error deleting score:", error);
    res.status(500).send("Error deleting score");
  }
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
