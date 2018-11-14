'use strict';
const faker = require( "faker" );

const topics = [];
for ( let i = 0; i < 10; i++ ) {
  topics.push( {
    title: faker.hacker.noun(),
    description: faker.hacker.phrase(),
    createdAt: new Date(),
    updatedAt: new Date()
  } );
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert( "Topics", topics, {} );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete( "Topics", null, {} );
  }
};
