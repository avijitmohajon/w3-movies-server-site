require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());
app.get(["/*.ico", "/*.png"], (req, res) => res.status(204).end());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.wye4e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const moviesCollection = client.db("moviesDatabase").collection("movie");

    app.get("/movie", async (req, res) => {
      const result = await moviesCollection.find().toArray();
      res.send(result);
    });

    // for update information

    app.get("/movie/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await moviesCollection.findOne(query);
      res.send(result);
    });

    app.post("/movie", async (req, res) => {
      const newMovie = req.body;
      // console.log(newMovie);
      const result = await moviesCollection.insertOne(newMovie);
      res.send(result);
    });

    // update data
    app.put("/movie/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateMovie = req.body;
      const setUpdateMovie = {
        $set: {
          poster: updateMovie.poster,
          title: updateMovie.title,
          genre: updateMovie.genre,
          duration: updateMovie.duration,
          releaseYear: updateMovie.releaseYear,
          rating: updateMovie.rating,
          summary: updateMovie.summary,
        },
      };

      const result = await moviesCollection.updateOne(
        filter,
        setUpdateMovie,
        options
      );
      res.send(result);
    });

    app.delete("/movie/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await moviesCollection.deleteOne(query);
      res.send(result);
    });

    // console.log(
    //   "Awesome!. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("movies server is running");
});
app.listen(port, () => {
  // console.log(`movies server is running on port :${port}`);
});
