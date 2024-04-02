const mongoose = require('mongoose');
const fs = require('fs');

// Connection URI
const uri = 'mongodb://localhost:27017/heli_verse_user';

// Read data from JSON file
const data = JSON.parse(fs.readFileSync('heliverse_mock_data.json'));

async function importData() {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri);
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
