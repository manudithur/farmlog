const mongoose = require('mongoose');
import dotenv from 'dotenv';

dotenv.config();


const uri = import.meta.env.VITE_MONGO_URI!

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error: any) => {
    console.error('Error connecting to MongoDB:', error);
  });

export default mongoose;