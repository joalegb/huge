import * as serverless from 'serverless-http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { parseBody, parseUser } from '../lib/utils';
import { handler as retrieve } from './services/retrieve';
import { handler as create } from './services/create';
import { handler as modify } from './services/modify';
import { handler as deleteAdv } from './services/delete';
import { handler as searchByDate } from './services/searchByDate';
import { handler as searchByCategory } from './services/searchByCategory';

const app = express();

app.use((req, res, next) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/advertisement', parseUser, async (req, res) => {
  const result = await retrieve(req);
  return res.status(result.status).send(result.response);
});

app.get('/advertisement/searchByDate', parseUser, async (req, res) => {
  const result = await searchByDate(req);
  return res.status(result.status).send(result.response);
});

app.get('/advertisement/searchByCategory', parseUser, async (req, res) => {
  const result = await searchByCategory(req);
  return res.status(result.status).send(result.response);
});

app.post('/advertisement', parseBody, parseUser, async (req, res) => {
  const result = await create(req);
  return res.status(result.status).send(result.response);
});

app.put('/advertisement', parseBody, parseUser, async (req, res) => {
  const result = await modify(req);
  return res.status(result.status).send(result.response);
});

app.delete('/advertisement', parseBody, parseUser, async (req, res) => {
  const result = await deleteAdv(req);
  return res.status(result.status).send(result.response);
});

const handler = serverless(app);
export { handler };
