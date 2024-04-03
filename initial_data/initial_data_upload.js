require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

// Connection URI
const db_link = 'mongodb+srv://umangjaiswal2003:p2geuXbIVCEQECXj@cluster0.rnbq14x.mongodb.net/heli_verse?retryWrites=true&w=majority&appName=Cluster0'
console.log(db_link)
// Read data from JSON file
const data = JSON.parse(fs.readFileSync('heliverse_mock_data.json'));

async function importData() {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(db_link);
    console.log('Connection to MongoDB successful');

    // Define Mongoose schema for the collection
    const Schema = mongoose.Schema;
    const yourSchema = new Schema({
      // Define the schema fields based on your JSON data structure
      // Example:
      id: Number,
      first_name: String,
      last_name: String,
      email: String,
      gender: String,
      avatar: String,
      domain: String,
      available: Boolean
    });

    // Create Mongoose model for the collection
    const member = mongoose.model('members', yourSchema);

    // Insert data into MongoDB collection using Mongoose model
    const result = await member.insertMany(data);
    console.log(`${result.length} documents inserted.`);
  } catch (err) {
    console.error('Error occurred while importing data:', err);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
  }
}

importData();
