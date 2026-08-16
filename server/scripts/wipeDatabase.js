const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const wipeDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const collections = await mongoose.connection.db.listCollections().toArray();

    for (const { name } of collections) {
      await mongoose.connection.db.collection(name).deleteMany({});
      console.log(`Cleared collection: ${name}`);
    }

    console.log('Database wiped clean.');
  } catch (error) {
    console.error('Error wiping database:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

wipeDatabase();