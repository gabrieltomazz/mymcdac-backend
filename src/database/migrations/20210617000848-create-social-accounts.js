module.exports = {
    up: async (queryInterface, Sequelize) => queryInterface.createTable('social_accounts', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        provider_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        provider: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            reference: { model: 'users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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
    }),

    down: async (queryInterface) => queryInterface.dropTable('social_accounts'),
};
