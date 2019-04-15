import * as moment from 'moment';
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
    advertisement = await advModel.findOne({
      where: {
        id: event.body.id,
        userId: event.body.userId
      },
      raw: true
    }) as Advertisement;
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

  const startDate = moment(event.body.startDate || advertisement.startDate);
  const endDate = moment(event.body.endDate || advertisement.endDate);

  if (!startDate.isValid() || !endDate.isValid() || startDate.isBefore(moment())
    || endDate.isBefore(startDate)) {
    dbManager.close();
    return {
      status: 400,
      response: {
        error: `Invalid event Dates`
      }
    };
  }

  try {
    await advModel.update({
      message: event.body.message || advertisement.message,
      url: event.body.url || advertisement.url,
      category: event.body.category || advertisement.category,
      startDate,
      endDate
    }, {
        where: {
          id: event.body.id,
          userId: event.body.userId
        }
      });
  } catch (error) /* istanbul ignore next */ {
    dbManager.close();
    return {
      status: 500,
      response: {
        error: `Error updating advertisement`
      }
    };
  }

  let updatedObject: Advertisement;
  try {
    updatedObject = await advModel.findOne({
      where: {
        id: event.body.id,
        userId: event.body.userId
      },
      raw: true }) as Advertisement;
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
    response: { data: updatedObject }
  };
};

export { handler };
