import Sequelize, { Model } from 'sequelize';

class Scale extends Model {
    static init(sequelize) {
        super.init(
            {
                description: Sequelize.STRING,
            },
            {
                sequelize,
            },
        );

        return this;
    }

    static associate(models) {
        Scale.belongsTo(models.User, { foreignKey: 'user_id' });
        Scale.hasMany(models.OptionAnswer, { as: 'optionAnswers', onDelete: 'CASCADE' });
    }
}

export default Scale;
