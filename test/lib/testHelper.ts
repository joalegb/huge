import * as Sequelize from 'sequelize';
import DBManager from '../../lib/dbManager';
import advertisement from '../../models/advertisement';
import user from '../../models/user';
import { handler as createUser } from '../../util/services/createUser';

class TestHelper {
  dbManager: DBManager;
  private advertisementModel: Sequelize.Model<{}, {}>;
  private userModel: Sequelize.Model<{}, {}>;

  constructor() { }

  async init() {
    this.dbManager = new DBManager();
    this.dbManager.open();
    this.advertisementModel = advertisement(this.dbManager);
    this.userModel = user(this.dbManager);
  }

  async createUser() {
    return await createUser({});
  }

  async clearAdvertisements() {
    await this.advertisementModel.destroy({ where: {} });
  }

  async clearUsers () {
    await this.userModel.destroy({ where: {} });
  }

  async close() {
    this.dbManager.close();
  }

}

export default TestHelper;
