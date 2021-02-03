'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('option_answers', { 
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
        reference: {model: 'scales', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false, 
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
    return queryInterface.dropTable('option_answers');
  }
};
