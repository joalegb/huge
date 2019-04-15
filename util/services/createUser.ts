import DBManager from '../../lib/dbManager';
import { getUserModel } from '../../models';
import * as crypto from 'crypto';

const handler = async (event: Obj): Promise<HandlerResponse> => {
  const dbManager = new DBManager();
  dbManager.open();
  const userModel = getUserModel(dbManager);
  let userResponse: Obj;
  const randomId = crypto.randomBytes(5).toString('hex');

  try {
    userResponse = await userModel.create({
      id: '',
      firstName: `User ${randomId}`,
      lastName: `User ${randomId}`,
      email: `user${randomId}@gmail.com`
    });
  } catch (error) /* istanbul ignore next */ {
    dbManager.close();
    return {
      status: 500,
      response: {
        error: `Internal error`
      }
    };
  }

  dbManager.close();

  return {
    status: 200,
    response: { data: userResponse.dataValues }
  };
};

export { handler };
