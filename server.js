const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
//Use your mongoAtlas URI in the format 'mongodb://username:password@host:port/database?options'
const mongoURI = 'YOUR_MONGO_URI';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Connected!"))
  .catch((error) => console.error(error));

// Mongoose Model
const locationSchema = new mongoose.Schema({
  name: String,
});

const Locations = mongoose.model('Locations', locationSchema);

// ROUTES
//Fetch all locations
app.get('/locations', async (req, res) => {
  try {
    const allLocations = await Locations.find();
    res.json(allLocations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Add a new location
app.post('/locations', async (req, res) => {
  try {
    const { name } = req.body;
    await Locations.create({ name });
    res.send("New location added!");
  } catch (error) {
    console.error("Error adding location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Delete a location
app.delete('/locations', async (req, res) => {
  try {
    const delName = req.body.name;
    await Locations.deleteMany({ name: delName });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
