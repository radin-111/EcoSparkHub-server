import express from 'express';
import cors from 'cors';
import { indexRoutes } from './app/routes';
import { notFound } from './app/middlewares/notfound';


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", indexRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use(notFound);
export default app;