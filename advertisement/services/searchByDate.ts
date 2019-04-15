import * as moment from 'moment';
import DBManager from '../../lib/dbManager';
import { getAdvertisementModel } from '../../models';

const handler = async (event: Obj): Promise<HandlerResponse> => {
  if (!('startDate' in event.query) && !('endDate' in event.query)) {
    return {
      status: 400,
      response: {
        error: `Missing date param`
      }
    };
  }

  let startDate;
  let endDate;
  if (event.query.startDate) {
    startDate = moment(event.query.startDate);
  }
  if (event.query.endDate) {
    endDate = moment(event.query.endDate);
  }

  if ((startDate && !startDate.isValid()) || (endDate && !endDate.isValid())) {
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
  let advertisements: Advertisement[];
  const where: Obj = {
    userId: event.query.userId
  };

  if (startDate) {
    where.startDate = {
      $gte: startDate.toDate()
    };
  }

  if (endDate) {
    where.endDate = {
      $lte: endDate.toDate()
    };
  }

  try {
    advertisements = await advModel.findAll({
      where,
      raw: true
    }) as Advertisement[];
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
