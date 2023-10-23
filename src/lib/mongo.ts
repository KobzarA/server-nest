import mongoose from 'mongoose';

// Replace the uri string with your connection string.
const url = process.env.MONGO_URL as string;
const dbName = process.env.DB_NAME as string;
async function connectMongo() {
  try {
    await mongoose.connect(`${url}${dbName}`);
    console.info('MongoDB connected', mongoose.connection.db.namespace);
  } catch (error) {
    console.error('Connection to MongoDB failed:/n', error);
  }
}

async function disconnectMongo() {
  try {
    await mongoose.disconnect();
    console.info('MongoDB disconnected');
  } catch (error) {
    console.error('Disconnection from MongoDB failed:/n', error);
  }
}

export { connectMongo, disconnectMongo };
