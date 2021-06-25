module.exports = {
    up: async (queryInterface, Sequelize) => queryInterface.createTable('option_answers', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        answer: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        neutral: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        good: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        scale_id: {
            type: Sequelize.INTEGER,
            reference: { model: 'scales', key: 'id' },
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
    }).then(() => queryInterface.addConstraint('option_answers', {
        fields: ['scale_id'],
        type: 'foreign key',
        references: {
            table: 'scales',
            field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
    })),

    down: async (queryInterface) => queryInterface.dropTable('option_answers'),
};
