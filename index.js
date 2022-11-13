require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, Timestamp } = require("mongodb");
const app = express();
const port = 5000;
/* --------------------------------------------------------------------- */
/*                              middleware                              */
/* --------------------------------------------------------------------- */

app.use(cors());
app.use(express.json());
// routes section start
try {
  const client = new MongoClient(process.env.URI);
  const serviceCollection = client
    .db("diagnostic-center")
    .collection("services");
  const doctors = client.db("diagnostic-center").collection("doctors");
  app.get("/", (req, res) => {
    res.send("Diagnostic center server is running");
  });
  /* ----------------------- service routes started ---------------------- */
  app.post("/service", async (req, res) => {
    const result = await serviceCollection.insertOne({
      timestamp: new Timestamp(),
      ...req.body,
    });

    res.send(result);
  });
  app.get("/service", async (req, res) => {
    const cursor = serviceCollection.find({}, { projection: { timestamp: 0 } });
    const data = await cursor
      .limit(parseInt(req.query.limit) || 0)
      .sort({ timestamp: -1 })
      .toArray();
    res.send(data);
  });
  /* --------------------------------------------------------------------- */

  /* -------------------------- doctors section -------------------------- */
  app.post("/doctor", async (req, res) => {
    const result = await doctors.insertOne({
      timestamp: new Timestamp(),
      ...req.body,
    });
    res.send(result);
  });
  app.get("/doctor", async (req, res) => {
    const cursor = doctors.find({}, { projection: { timestamp: 0 } });
    const data = await cursor
      .limit(parseInt(req.query.limit) || 0)
      .sort({ timestamp: -1 })
      .toArray();
    res.send(data);
  });
  /* --------------------------------------------------------------------- */
} catch (error) {
  console.log("🚀 > error", error);
}
// routes section end
app.listen(port, () => console.log(`App listening on port ${port}!`));
