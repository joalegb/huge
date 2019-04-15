import * as serverless from 'serverless-http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { handler as createUser } from './services/createUser';

const app = express();

app.use((req, res, next) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/util', async (req, res) => {
  const result = await createUser(req);
  return res.status(result.status).send(result.response);
});

const handler = serverless(app);
export { handler };
