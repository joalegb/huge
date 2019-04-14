import DBManager from '../../lib/dbManager';
import validate from '../../lib/validate';
import { getAdvertisementModel } from '../../models';

const handler = async (event: Obj): Promise<HandlerResponse> => {
  const missingParam = validate(['id'], event.body);
  if (missingParam) {
    return {
      status: 400,
      response: {
        error: `Missing ${missingParam} param`
      }
    };
  }

  const dbManager = new DBManager();
  dbManager.open();
  const advModel = getAdvertisementModel(dbManager);
  let advertisement: Advertisement;

  try {
    advertisement = await advModel.findOne({ where: { id: event.body.id }, raw: true }) as Advertisement;
  } catch (error) /* istanbul ignore next */ {
    dbManager.close();
    return {
      status: 500,
      response: {
        error: `Internal error`
      }
    };
  }

  if (!advertisement) {
    dbManager.close();
    return {
      status: 404,
      response: {
        error: `Advertisement ${event.body.id} not found`
      }
    };
  }

  try {
    await advModel.destroy({ where: { id: event.body.id } });
  } catch (error) /* istanbul ignore next */ {
    dbManager.close();
    return {
      status: 500,
      response: {
        error: `Error deleting advertisement`
      }
    };
  }

  dbManager.close();
  return {
    status: 200,
    response: {
      message: 'Advertisement deleted'
    }
  };
};

export { handler };
