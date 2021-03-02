import Sequelize, { Model } from 'sequelize';

class Criteria extends Model {

    static init(sequelize){
        super.init(
            {
                name: Sequelize.STRING,
                title: Sequelize.STRING,
                percent: Sequelize.INTEGER,
                sequence: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models){
        this.belongsTo(models.Project, { foreignKey: 'project_id'});
        this.belongsTo(models.Criteria, { foreignKey: 'criteria_id'});
    };
    
}

export default Criteria;