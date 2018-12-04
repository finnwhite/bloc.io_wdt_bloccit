'use strict';

const seeds = {
  votes: [ {
    value: -1,
    postId: 2, // "Watching snow melt"
    userId: 1
  }, {
    value: 1,
    postId: 2, // "Watching snow melt"
    userId: 2
  }, {
    value: 1,
    postId: 3, // "Snowman Building Competition"
    userId: 2
  }, {
    value: -1,
    postId: 4, // "Outdoor Escape!"
    userId: 1
  }, {
    value: -1,
    postId: 4, // "Outdoor Escape!"
    userId: 2
  }, {
    value: 1,
    postId: 5, // "My first visit to Proxima Centauri b"
    userId: 1
  }, {
    value: 1,
    postId: 5, // "My first visit to Proxima Centauri b"
    userId: 2
  } ]
};

module.exports = {
  up: ( queryInterface, Sequelize ) => {

    const votes = [];
    seeds.votes.forEach( ( seed ) => {
      const values = { ...seed };
      values.createdAt = new Date();
      values.updatedAt = new Date();
      votes.push( values );
    } );

    return queryInterface.bulkInsert( "Votes", votes, {} );
  },
  down: ( queryInterface, Sequelize ) => {
    return queryInterface.bulkDelete( "Votes", null, {} );
  }
};
