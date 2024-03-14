import express from 'express';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import farmRoutes from './routes/farmRoutes';
import fieldRoutes from './routes/fieldRoutes';

const cors = require('cors');

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.PORT) {
  console.log('Please define JWT_SECRET, MONGO_URI and PORT in .env file');
  process.exit(1);
}

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});

app.use(cors())

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

app.use('/users', userRoutes);
app.use('/farms', farmRoutes);
app.use('/fields', fieldRoutes);

export default app;