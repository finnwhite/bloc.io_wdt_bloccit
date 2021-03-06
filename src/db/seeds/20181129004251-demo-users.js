'use strict';

require( "dotenv" ).config();

const seeds = {
  users: [ {
    email: "admin@example.com",
    password: process.env.megasecret,
    role: "admin"
  }, {
    email: "member@example.com",
    password: process.env.megasecret,
    role: "member"
  } ]
};

module.exports = {
  up: ( queryInterface, Sequelize ) => {

    const users = [];
    seeds.users.forEach( ( seed ) => {
      const values = { ...seed };
      values.createdAt = new Date();
      values.updatedAt = new Date();
      users.push( values );
    } );

    return queryInterface.bulkInsert( "Users", users, {} );
  },
  down: ( queryInterface, Sequelize ) => {
    return queryInterface.bulkDelete( "Users", null, {} );
  }
};
