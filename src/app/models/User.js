import { Sequelize } from 'sequelize';
import Sequelize, { Model } from 'sequelize';


class User extends Model {

    static init(sequelize){
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                university: Sequelize.STRING,
                country: Sequelize.STRING,
                password_hash: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
    }

}

export default User;