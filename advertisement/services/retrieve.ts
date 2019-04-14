import DBManager from '../../lib/dbManager';
import validate from '../../lib/validate';
import { getAdvertisementModel } from '../../models';

const handler = async (event: Obj): Promise<HandlerResponse> => {
  const missingParam = validate(['id'], event.query);
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
    advertisement = await advModel.findOne({ where: { id: event.query.id }, raw: true }) as Advertisement;
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

  if (!advertisement) {
    return {
      status: 404,
      response: {
        error: `Advertisement ${event.query.id} not found`
      }
    };
  }

  return {
    status: 200,
    response: { data: advertisement }
  };
};

export { handler };
