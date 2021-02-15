import Sequelize, { Model } from 'sequelize';

class OptionAnswer extends Model {

    static init(sequelize){
        super.init(
            {
                answer: Sequelize.STRING,
                neutral: Sequelize.BOOLEAN,
                good: Sequelize.BOOLEAN
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models){
        this.belongsTo(models.Scale, { foreignKey: 'scale_id'});
    };

}

export default OptionAnswer;