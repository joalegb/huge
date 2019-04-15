import * as Sequelize from 'sequelize';
import DBManager from '../lib/dbManager';

function getAdvertisementModel(dbManagerObj: DBManager) {
  const sequelize = dbManagerObj.getManagerObject();
  const advertisementModel = sequelize.define('advertisement', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: Sequelize.INTEGER,
    message: Sequelize.STRING,
    url: Sequelize.STRING,
    category: Sequelize.STRING,
    startDate: Sequelize.DATE,
    endDate: Sequelize.DATE
  },
    {
      timestamps: false,
      freezeTableName: true
    });

  advertisementModel.sync();

  return advertisementModel;
}

export default getAdvertisementModel;
