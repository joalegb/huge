import * as Sequelize from 'sequelize';
import DBManager from '../lib/dbManager';

function getUserModel(dbManagerObj: DBManager) {
  const sequelize = dbManagerObj.getManagerObject();
  const userModel = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
  },
    {
      timestamps: false,
      freezeTableName: true
    });

  userModel.sync();

  return userModel;
}

export default getUserModel;
