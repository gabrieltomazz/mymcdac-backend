module.exports = {
    up: async (queryInterface, Sequelize) => queryInterface.createTable('criteria', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        percent: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        sequence: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        order: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        criterion_id: {
            type: Sequelize.INTEGER,
            reference: { model: 'criteria', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: true,
        },
        project_id: {
            type: Sequelize.INTEGER,
            reference: { model: 'project', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    }).then(() => queryInterface.addConstraint('criteria', {
        fields: ['criterion_id'],
        type: 'foreign key',
        references: {
            table: 'criteria',
            field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
    })).then(() => queryInterface.addConstraint('criteria', {
        fields: ['project_id'],
        type: 'foreign key',
        references: {
            table: 'projects',
            field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
    })),

    down: async (queryInterface) => queryInterface.dropTable('criteria'),
};
