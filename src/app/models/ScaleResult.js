import Sequelize, { Model } from 'sequelize';

class ScaleResult extends Model {
    static init(sequelize) {
        super.init(
            {
                value: Sequelize.INTEGER,
                median: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            },
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Criteria, { foreignKey: 'criterion_id' });
        this.belongsTo(models.OptionAnswer, { foreignKey: 'option_answer_id' });
    }
}

export default ScaleResult;
