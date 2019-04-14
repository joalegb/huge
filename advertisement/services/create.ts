import * as moment from 'moment';
import DBManager from '../../lib/dbManager';
import validate from '../../lib/validate';
import { getAdvertisementModel } from '../../models';

const handler = async (event: Obj): Promise<HandlerResponse> => {
  const missingParam = validate(['message', 'url', 'category', 'startDate', 'endDate'], event.body);
  if (missingParam) {
    return {
      status: 400,
      response: {
        error: `Missing ${missingParam} param`
      }
    };
  }

  const startDate = moment(event.body.startDate);
  const endDate = moment(event.body.endDate);

  if (!startDate.isValid() || !endDate.isValid() || startDate.isBefore(moment())
    || endDate.isBefore(startDate)) {
    return {
      status: 400,
      response: {
        error: `Invalid event Dates`
      }
    };
  }

  const dbManager = new DBManager();
  dbManager.open();
  const advModel = getAdvertisementModel(dbManager);
  let objectResponse: Obj;
  const { message, url, category } = event.body;

  try {
    objectResponse = await advModel.create({
      id: '',
      message,
      url,
      category,
      startDate,
      endDate
    });
  } catch (error) /* istanbul ignore next */ {
    dbManager.close();
    return {
      status: 500,
      response: {
        error: `Error creating advertisement`
      }
    };
  }
  dbManager.close();
  return {
    status: 200,
    response: { data: objectResponse.dataValues }
  };
};

export { handler };
