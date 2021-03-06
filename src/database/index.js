import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Scale from '../app/models/Scale';
import OptionAnswer from '../app/models/OptionAnswer';
import Project from '../app/models/Project';
import Criteria from '../app/models/Criteria';
import ScaleResult from '../app/models/ScaleResult';
import SocialAccount from '../app/models/SocialAccount';

const models = [User, Scale, OptionAnswer, Project, Criteria, ScaleResult, SocialAccount];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connecion = new Sequelize(databaseConfig);

        models
            .map((model) => model.init(this.connecion))
            .map((model) => model.associate && model.associate(this.connecion.models));
    }
}

export default new Database();
