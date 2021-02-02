import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';


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

}

export default Scale;