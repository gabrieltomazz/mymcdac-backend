import Sequelize, { Model } from 'sequelize';

class SocialAccount extends Model {
    static init(sequelize) {
        super.init(
            {
                provider_id: Sequelize.STRING,
                provider: Sequelize.STRING,
            },
            {
                sequelize,
            },
        );

        return this;
    }

    static associate(models) {
        SocialAccount.belongsTo(models.User, { foreignKey: 'user_id' });
    }
}

export default SocialAccount;
