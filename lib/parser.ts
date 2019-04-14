import { Request, Response, NextFunction } from 'express';

const parseBody = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = JSON.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid Request' });
  }

  next();
};

export {
  parseBody
};
