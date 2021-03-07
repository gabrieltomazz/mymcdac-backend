import Sequelize, { Model } from 'sequelize';

class Criteria extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        title: Sequelize.STRING,
        percent: Sequelize.INTEGER,
        sequence: Sequelize.STRING,
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Project, { foreignKey: 'project_id' });
    this.hasMany(models.Criteria, { foreignKey: 'criterion_id', as: 'children' });
  }
}

export default Criteria;
