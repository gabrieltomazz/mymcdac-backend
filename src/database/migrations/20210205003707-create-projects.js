module.exports = {
    up: async (queryInterface, Sequelize) => queryInterface.createTable('projects', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        project_goal: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        performance: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        steps: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        start_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        end_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            reference: { model: 'users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
        },
        scale_id: {
            type: Sequelize.INTEGER,
            reference: { model: 'scales', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    }).then(() => queryInterface.addConstraint('projects', {
        fields: ['user_id'],
        type: 'foreign key',
        references: {
            table: 'users',
            field: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
    })).then(() => queryInterface.addConstraint('projects', {
        fields: ['scale_id'],
        type: 'foreign key',
        references: {
            table: 'scales',
            field: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
    })),

    down: async (queryInterface) => queryInterface.dropTable('projects'),
};
