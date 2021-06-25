module.exports = {
    up: async (queryInterface, Sequelize) => queryInterface.createTable('scale_results', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        value: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        median: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        criterion_id: {
            type: Sequelize.INTEGER,
            reference: { model: 'criteria', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
        },
        option_answer_id: {
            type: Sequelize.INTEGER,
            reference: { model: 'option_answers', key: 'id' },
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
    }).then(() => queryInterface.addConstraint('scale_results', {
        fields: ['criterion_id'],
        type: 'foreign key',
        references: {
            table: 'criteria',
            field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
    })).then(() => queryInterface.addConstraint('scale_results', {
        fields: ['option_answer_id'],
        type: 'foreign key',
        references: {
            table: 'option_answers',
            field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
    })),

    down: async (queryInterface) => queryInterface.dropTable('scale_results'),
};
