'use strict';

const seeds = {
  users: [ {
    email: "admin@example.com",
    password: "123456",
    role: "admin"
  }, {
    email: "member@example.com",
    password: "123456",
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
