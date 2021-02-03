import Sequelize, { Model } from 'sequelize';

class Scale extends Model {

    static init(sequelize){
        super.init(
            {
                description: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user_id'});
    };
    
}

export default Scale;