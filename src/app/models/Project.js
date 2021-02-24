import Sequelize, { Model } from 'sequelize';

class Project extends Model {

    static init(sequelize){
        super.init(
            {
                project_goal: Sequelize.STRING,
                project_locus: Sequelize.STRING,
                performance: Sequelize.STRING,
                steps: Sequelize.INTEGER,
                start_date: Sequelize.DATE,
                end_date:Sequelize.DATE
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'user_id'}),
        this.belongsTo(models.Scale, { foreignKey: 'scale_id', as: 'scale'});
    };

}

export default Project;