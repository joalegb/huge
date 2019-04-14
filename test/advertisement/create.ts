
import * as chai from 'chai';
import * as moment from 'moment';
import testHelper from '../lib/testHelper';
import { handler as createAdvertisement } from '../../advertisement/services/create';

const expect = chai.expect;
const testHelperObj = new testHelper();

describe('Advertisement - create test', () => {
  before(async () => {
    await testHelperObj.init();
    await testHelperObj.clearAdvertisements();
  });

  after(async () => {
    await testHelperObj.close();
  });

  it('Save advertisement without message param', async () => {
    const req = {
      body: {}
    };

    const resp = await createAdvertisement(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Missing message param');
  });

  it('Save advertisement without url param', async () => {
    const req = {
      body: {
        message: 'Advertisement # 1'
      }
    };

    const resp = await createAdvertisement(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Missing url param');
  });

  it('Save advertisement without category param', async () => {
    const req = {
      body: {
        message: 'Advertisement # 1',
        url: 'www.google.com'
      }
    };

    const resp = await createAdvertisement(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Missing category param');
  });

  it('Save advertisement without startDate param', async () => {
    const req = {
      body: {
        message: 'Advertisement # 1',
        url: 'www.google.com',
        category: 'test'
      }
    };

    const resp = await createAdvertisement(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Missing startDate param');
  });

  it('Save advertisement without endDate param', async () => {
    const req = {
      body: {
        message: 'Advertisement # 1',
        url: 'www.google.com',
        category: 'test',
        startDate: '2019-04-15 09:07:28'
      }
    };

    const resp = await createAdvertisement(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Missing endDate param');
  });

  it('Save advertisement with invalid startDate param', async () => {
    const req = {
      body: {
        message: 'Advertisement # 1',
        url: 'www.google.com',
        category: 'test',
        startDate: 'INVALID DATE',
        endDate: '2019-04-15 09:07:28',
      }
    };

    const resp = await createAdvertisement(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Invalid event Dates');
  });

  it('Save advertisement with invalid endDate param', async () => {
    const req = {
      body: {
        message: 'Advertisement # 1',
        url: 'www.google.com',
        category: 'test',
        startDate: '2019-04-15 09:07:28',
        endDate: 'INVALID DATE',
      }
    };

    const resp = await createAdvertisement(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Invalid event Dates');
  });

  it('Save advertisement with old start date', async () => {
    const req = {
      body: {
        message: 'Advertisement # 1',
        url: 'www.google.com',
        category: 'test',
        startDate: '2010-04-15 09:07:28',
        endDate: '2019-04-15 09:07:28',
      }
    };

    const resp = await createAdvertisement(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Invalid event Dates');
  });

  it('Save advertisement with endDate before startDate', async () => {
    const req = {
      body: {
        message: 'Advertisement # 1',
        url: 'www.google.com',
        category: 'test',
        startDate: '2019-04-15 09:07:28',
        endDate: '2019-04-14 09:07:28',
      }
    };

    const resp = await createAdvertisement(req);
    expect(resp.status).to.eq(400);
    expect(resp.response.error).to.eq('Invalid event Dates');
  });

  it('Save advertisement with all params valid', async () => {
    const req = {
      body: {
        message: 'Advertisement # 1',
        url: 'www.google.com',
        category: 'test',
        startDate: '2019-04-15 09:07:28',
        endDate: '2019-04-16 09:07:28',
      }
    };

    const resp = await createAdvertisement(req);
    expect(resp.status).to.eq(200);
    expect(resp.response.data).to.exist;
    expect(resp.response.data.message).to.eq(req.body.message);
    expect(resp.response.data.url).to.eq(req.body.url);
    expect(resp.response.data.category).to.eq(req.body.category);
    expect(moment(resp.response.data.startDate).format()).to.eq(moment(req.body.startDate).format());
    expect(moment(resp.response.data.endDate).format()).to.eq(moment(req.body.endDate).format());
  });

});
