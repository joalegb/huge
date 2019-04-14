
import * as chai from 'chai';
import * as moment from 'moment';

import testHelper from '../lib/testHelper';
import { handler as createAdvertisement } from '../../advertisement/services/create';
import { handler as modifyAdvertisement } from '../../advertisement/services/modify';

const expect = chai.expect;
const testHelperObj = new testHelper();

describe('Advertisement - modify test', () => {
  before(async () => {
    await testHelperObj.init();
    await testHelperObj.clearAdvertisements();
  });

  after(async () => {
    await testHelperObj.close();
  });

  it('Update advertisement without id param', async () => {
    const req = {
      body: {}
    };

    const resp = await modifyAdvertisement(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Missing id param');
  });

  it('Update missing advertisement', async () => {
    const req = {
      body: {
        id: 1
      }
    };

    const resp = await modifyAdvertisement(req);
    expect(resp.status).to.eq(404);
    expect(resp.response.error).to.eq(`Advertisement ${req.body.id} not found`);
  });

  it('Update advertisement with invalid startDate param', async () => {
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

    const modifyReq = {
      body: {
        id: createResp.response.id,
        startDate: 'INVALID DATE'
      }
    };
    const resp = await modifyAdvertisement(modifyReq);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Invalid event Dates');
  });

  it('Update advertisement with invalid endDate param', async () => {
    const req = {
      body: {
        message: 'Advertisement # 2',
        url: 'www.google.com',
        category: 'test',
        startDate: '2019-04-15 09:07:28',
        endDate: '2019-04-16 09:07:28',
      }
    };

    const createResp = await createAdvertisement(req);

    const modifyReq = {
      body: {
        id: createResp.response.id,
        endDate: 'INVALID DATE'
      }
    };
    const resp = await modifyAdvertisement(modifyReq);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Invalid event Dates');
  });

  it('Update advertisement with old startDate param', async () => {
    const req = {
      body: {
        message: 'Advertisement # 3',
        url: 'www.google.com',
        category: 'test',
        startDate: '2019-04-15 09:07:28',
        endDate: '2019-04-16 09:07:28',
      }
    };

    const createResp = await createAdvertisement(req);

    const modifyReq = {
      body: {
        id: createResp.response.id,
        startDate: '2010-04-15 09:07:28'
      }
    };
    const resp = await modifyAdvertisement(modifyReq);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Invalid event Dates');
  });

  it('Update advertisement with endDate before original startDate', async () => {
    const req = {
      body: {
        message: 'Advertisement # 4',
        url: 'www.google.com',
        category: 'test',
        startDate: '2019-04-15 09:07:28',
        endDate: '2019-04-16 09:07:28',
      }
    };

    const createResp = await createAdvertisement(req);

    const modifyReq = {
      body: {
        id: createResp.response.id,
        endDate: '2019-04-14 09:07:28'
      }
    };
    const resp = await modifyAdvertisement(modifyReq);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Invalid event Dates');
  });

  it('Update advertisement with valid params, update dates', async () => {
    const req = {
      body: {
        message: 'Advertisement # 5',
        url: 'www.google.com',
        category: 'test',
        startDate: '2019-04-15 09:07:28',
        endDate: '2019-04-16 09:07:28',
      }
    };

    const createResp = await createAdvertisement(req);

    const modifyReq = {
      body: {
        id: createResp.response.id,
        startDate: '2029-04-15 09:07:28',
        endDate: '2029-04-16 09:07:28',
      }
    };
    const resp = await modifyAdvertisement(modifyReq);
    expect(resp.status).to.eq(200);
    expect(resp.response.message).to.eq(req.body.message);
    expect(resp.response.url).to.eq(req.body.url);
    expect(resp.response.category).to.eq(req.body.category);
    expect(moment(resp.response.startDate).format()).to.eq(moment(modifyReq.body.startDate).format());
    expect(moment(resp.response.endDate).format()).to.eq(moment(modifyReq.body.endDate).format());
  });

  it('Update advertisement with valid params, update all', async () => {
    const req = {
      body: {
        message: 'Advertisement # 6',
        url: 'www.google.com',
        category: 'test',
        startDate: '2019-04-15 09:07:28',
        endDate: '2019-04-16 09:07:28',
      }
    };

    const createResp = await createAdvertisement(req);

    const modifyReq = {
      body: {
        id: createResp.response.id,
        message: 'Advertisement # 6 Updated',
        url: 'www.google.com/?updated=true',
        category: 'test updated',
        startDate: '2029-04-15 09:07:28',
        endDate: '2029-04-16 09:07:28',
      }
    };
    const resp = await modifyAdvertisement(modifyReq);
    expect(resp.status).to.eq(200);
    expect(resp.response.message).to.eq(modifyReq.body.message);
    expect(resp.response.url).to.eq(modifyReq.body.url);
    expect(resp.response.category).to.eq(modifyReq.body.category);
    expect(moment(resp.response.startDate).format()).to.eq(moment(modifyReq.body.startDate).format());
    expect(moment(resp.response.endDate).format()).to.eq(moment(modifyReq.body.endDate).format());
  });
});
