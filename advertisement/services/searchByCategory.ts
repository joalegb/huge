import DBManager from '../../lib/dbManager';
import validate from '../../lib/validate';
import { getAdvertisementModel } from '../../models';

const handler = async (event: Obj): Promise<HandlerResponse> => {
  const missingParam = validate(['category'], event.query);
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
  let advertisements: Advertisement[];

  try {
    advertisements = await advModel.findAll({
      where: { category: event.query.category },
      raw: true }) as Advertisement[];
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
    response: { data: advertisements }
  };
};

export { handler };
