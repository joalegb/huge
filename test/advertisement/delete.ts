
import * as chai from 'chai';

import testHelper from '../lib/testHelper';
import { handler as createAdvertisement } from '../../advertisement/services/create';
import { handler as deleteAdvertisement } from '../../advertisement/services/delete';

const expect = chai.expect;
const testHelperObj = new testHelper();

describe('Advertisement - delete test', () => {
  before(async () => {
    await testHelperObj.init();
    await testHelperObj.clearAdvertisements();
  });

  after(async () => {
    await testHelperObj.close();
  });

  it('Delete advertisement without id param', async () => {
    const req = {
      body: {}
    };

    const resp = await deleteAdvertisement(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Missing id param');
  });

  it('Delete missing advertisement', async () => {
    const req = {
      body: {
        id: 1
      }
    };

    const resp = await deleteAdvertisement(req);
    expect(resp.status).to.eq(404);
    expect(resp.response.error).to.eq(`Advertisement ${req.body.id} not found`);
  });

  it('Delete valid advertisement', async () => {
    const req = {
      body: {
        message: 'Advertisement # 1',
        url: 'www.google.com',
        category: 'test',
        startDate: '2019-04-15 09:07:28',
        endDate: '2019-04-16 09:07:28',
      }
    };

    const createResp = await createAdvertisement(req);

    const retrieveReq = {
      body: {
        id: createResp.response.data.id
      }
    };
    const resp = await deleteAdvertisement(retrieveReq);
    expect(resp.status).to.eq(200);
    expect(resp.response.message).to.eq('Advertisement deleted');
  });
});
