module.exports = {
    up: async (queryInterface, Sequelize) => queryInterface.createTable('scales', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            reference: { model: 'users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: false,
            constraints: true,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    }).then(() => queryInterface.addConstraint('scales', {
        fields: ['user_id'],
        type: 'foreign key',
        references: {
            table: 'users',
            field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
    })),

    down: async (queryInterface) => queryInterface.dropTable('scales'),
};
