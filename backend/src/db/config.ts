const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://user:password@localhost';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error: any) => {
    console.error('Error connecting to MongoDB:', error);
  });

export default mongoose;