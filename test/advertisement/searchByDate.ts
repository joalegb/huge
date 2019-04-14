
import * as chai from 'chai';

import testHelper from '../lib/testHelper';
import { handler as createAdvertisement } from '../../advertisement/services/create';
import { handler as searchByDate } from '../../advertisement/services/searchByDate';

const expect = chai.expect;
const testHelperObj = new testHelper();

describe('Advertisement - retrieve test', () => {
  before(async () => {
    await testHelperObj.init();
    await testHelperObj.clearAdvertisements();
  });

  after(async () => {
    await testHelperObj.close();
  });

  it('Retrieve advertisement without any date param', async () => {
    const req = {
      query: {}
    };

    const resp = await searchByDate(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Missing date param');
  });

  it('Retrieve advertisement with invalid startDate param', async () => {
    const req = {
      query: {
        startDate: 'INVALID DATE'
      }
    };

    const resp = await searchByDate(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Invalid event Dates');
  });

  it('Retrieve advertisement with invalid endDate param', async () => {
    const req = {
      query: {
        endDate: 'INVALID DATE'
      }
    };

    const resp = await searchByDate(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Invalid event Dates');
  });

  it('Create Test Advertisements', async () => {
    const req1 = {
      body: {
        message: 'Advertisement # 1',
        url: 'www.google.com',
        category: 'test',
        startDate: '2019-04-15 09:07:28',
        endDate: '2019-04-16 09:07:28',
      }
    };

    const req2 = {
      body: {
        message: 'Advertisement # 2',
        url: 'www.google.com',
        category: 'test',
        startDate: '2019-04-16 09:07:28',
        endDate: '2019-04-17 09:07:28',
      }
    };

    const req3 = {
      body: {
        message: 'Advertisement # 3',
        url: 'www.google.com',
        category: 'test',
        startDate: '2019-04-18 09:07:28',
        endDate: '2019-04-19 09:07:28',
      }
    };

    const req4 = {
      body: {
        message: 'Advertisement # 4',
        url: 'www.google.com',
        category: 'test',
        startDate: '2019-04-20 09:07:28',
        endDate: '2019-04-21 09:07:28',
      }
    };

    await createAdvertisement(req1);
    await createAdvertisement(req2);
    await createAdvertisement(req3);
    await createAdvertisement(req4);
  });

  it('Retrieve advertisement with startDate param', async () => {
    const req = {
      query: {
        startDate: '2019-04-18 09:07:28'
      }
    };

    const resp = await searchByDate(req);
    expect(resp.status).to.eq(200);
    expect(resp.response.data).to.exist;
    expect(resp.response.data.length).to.eq(2);
    expect(resp.response.data[0].message).to.eq('Advertisement # 3');
    expect(resp.response.data[1].message).to.eq('Advertisement # 4');
  });

  it('Retrieve advertisement with endDate param', async () => {
    const req = {
      query: {
        endDate: '2019-04-17 09:07:28'
      }
    };

    const resp = await searchByDate(req);
    expect(resp.status).to.eq(200);
    expect(resp.response.data).to.exist;
    expect(resp.response.data.length).to.eq(2);
    expect(resp.response.data[0].message).to.eq('Advertisement # 1');
    expect(resp.response.data[1].message).to.eq('Advertisement # 2');
  });

  it('Retrieve advertisement with both date params', async () => {
    const req = {
      query: {
        startDate: '2019-04-18 09:07:28',
        endDate: '2019-04-19 09:07:28'
      }
    };

    const resp = await searchByDate(req);
    expect(resp.status).to.eq(200);
    expect(resp.response.data).to.exist;
    expect(resp.response.data.length).to.eq(1);
    expect(resp.response.data[0].message).to.eq('Advertisement # 3');
  });
});
