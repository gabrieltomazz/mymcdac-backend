'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('users_has_scales', { 
      user_id: {
        type: Sequelize.INTEGER,
        reference: {model: 'users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true, 
      },
      scales_id: {
        type: Sequelize.INTEGER,
        reference: {model: 'scales', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true, 
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }, 
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users_has_scales');
  }
};
