import { Request, Response, NextFunction } from 'express';
import DBManager from './dbManager';
import { getUserModel } from '../models';

const parseBody = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = JSON.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid Request' });
  }

  next();
};

const parseUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId param' });
  }

  const dbManager = new DBManager();
  dbManager.open();
  const userModel = getUserModel(dbManager);
  let userData: Obj;

  try {
    userData = await userModel.findOne({ where: { id: userId }, raw: true });
  } catch (error) {
    dbManager.close();
    return res.status(400).json({ error: 'Internal error' });
  }

  dbManager.close();

  if (!userData) {
    return res.status(400).json({ error: 'Invalid user' });
  }

  next();
};

export {
  parseBody,
  parseUser
};
