import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Scale from '../app/models/Scale';
import OptionAnswer from '../app/models/OptionAnswer';
import Project from '../app/models/Project';

const models = [User, Scale, OptionAnswer, Project]

class Database {
    constructor(){
        this.init();
    }

    init(){
        this.connection = new Sequelize(databaseConfig);

        models.map( model => model.init(this.connection));
    }
}

export default new Database();
