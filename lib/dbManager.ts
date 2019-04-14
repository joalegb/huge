import * as Sequelize from 'sequelize';

class DBManager {
  private db: string;
  private user: string;
  private password: string;
  private host: string;
  private sequelize: Sequelize.Sequelize;

  constructor() {
    this.db = process.env.MYSQL_DB_NAME;
    this.user = process.env.MYSQL_DB_USERNAME;
    this.password = process.env.MYSQL_DB_PASSWORD;
    this.host = process.env.MYSQL_DB_HOST;
  }

  open() {
    this.sequelize = new Sequelize(this.db, this.user, this.password, {
      host: this.host,
      dialect: 'mysql',
      logging: false
    });
  }

  getManagerObject() {
    return this.sequelize;
  }

  close() {
    this.sequelize.close();
  }
}

export default DBManager;
