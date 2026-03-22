import express from 'express';
import cors from 'cors';
import { indexRoutes } from './app/routes';


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", indexRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});
export default app;