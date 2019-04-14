import * as Sequelize from 'sequelize';
import DBManager from '../../lib/dbManager';
import advertisement from '../../models/advertisement';

class TestHelper {
  dbManager: DBManager;
  private advertisementModel: Sequelize.Model<{}, {}>;

  constructor() { }

  async init() {
    this.dbManager = new DBManager();
    this.dbManager.open();
    this.advertisementModel = advertisement(this.dbManager);
  }

  async clearAdvertisements() {
    await this.advertisementModel.destroy({ where: {} });
  }

  async close() {
    this.dbManager.close();
  }

}

export default TestHelper;
