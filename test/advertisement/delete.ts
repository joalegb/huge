
import * as chai from 'chai';

import testHelper from '../lib/testHelper';
import { handler as createAdvertisement } from '../../advertisement/services/create';
import { handler as deleteAdvertisement } from '../../advertisement/services/delete';

const expect = chai.expect;
const testHelperObj = new testHelper();

let userId: number;

describe('Advertisement - delete test', () => {
  before(async () => {
    await testHelperObj.init();
    await testHelperObj.clearAdvertisements();
    const userResponse = await testHelperObj.createUser();
    userId = userResponse.response.data.id;
  });

  after(async () => {
    await testHelperObj.close();
  });

  it('Delete advertisement without id param', async () => {
    const req = {
      body: {
      }
    };

    const resp = await deleteAdvertisement(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Missing id param');
  });

  it('Delete missing advertisement', async () => {
    const req = {
      body: {
        id: 1,
      }
    };

    const resp = await deleteAdvertisement(req);
    expect(resp.status).to.eq(404);
    expect(resp.response.error).to.eq(`Advertisement ${req.body.id} not found`);
  });

  it('Delete valid advertisement', async () => {
    const req = {
      body: {
        userId,
        message: 'Advertisement # 1',
        url: 'www.google.com',
        category: 'test',
        startDate: '2020-04-15 09:07:28',
        endDate: '2020-04-16 09:07:28',
      }
    };

    const createResp = await createAdvertisement(req);
    const deleteReq = {
      body: {
        id: createResp.response.data.id,
        userId
      }
    };
    const resp = await deleteAdvertisement(deleteReq);
    expect(resp.status).to.eq(200);
    expect(resp.response.message).to.eq('Advertisement deleted');
  });
});
