
import * as chai from 'chai';
import * as moment from 'moment';

import testHelper from '../lib/testHelper';
import { handler as createAdvertisement } from '../../advertisement/services/create';
import { handler as retrieveAdvertisement } from '../../advertisement/services/retrieve';

const expect = chai.expect;
const testHelperObj = new testHelper();
let userId: number;

describe('Advertisement - retrieve test', () => {
  before(async () => {
    await testHelperObj.init();
    await testHelperObj.clearAdvertisements();
    await testHelperObj.clearUsers();
    const userResponse = await testHelperObj.createUser();
    userId = userResponse.response.data.id;
  });

  after(async () => {
    await testHelperObj.close();
  });

  it('Retrieve advertisement without id param', async () => {
    const req = {
      query: {}
    };

    const resp = await retrieveAdvertisement(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Missing id param');
  });

  it('Retrieve missing advertisement', async () => {
    const req = {
      query: {
        id: 1
      }
    };

    const resp = await retrieveAdvertisement(req);
    expect(resp.status).to.eq(404);
    expect(resp.response.error).to.eq(`Advertisement ${req.query.id} not found`);
  });

  it('Retrieve valid advertisement', async () => {
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

    const retrieveReq = {
      query: {
        userId,
        id: createResp.response.data.id
      }
    };
    const resp = await retrieveAdvertisement(retrieveReq);
    expect(resp.status).to.eq(200);
    expect(resp.response.data).to.exist;
    expect(resp.response.data.message).to.eq(req.body.message);
    expect(resp.response.data.url).to.eq(req.body.url);
    expect(resp.response.data.category).to.eq(req.body.category);
    expect(moment(resp.response.data.startDate).format()).to.eq(moment(req.body.startDate).format());
    expect(moment(resp.response.data.endDate).format()).to.eq(moment(req.body.endDate).format());
  });
});
