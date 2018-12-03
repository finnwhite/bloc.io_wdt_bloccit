'use strict';

const seeds = {
  comments: [ {
    body: "ay caramba!!!!!",
    postId: 5,
    userId: 2
  }, {
    body: "The geological kind.",
    postId: 5,
    userId: 1
  }, {
    body: "Are the inertial dampers still engaged?",
    postId: 5,
    userId: 1
  }, {
    body: "...it was a rock lobster!",
    postId: 5,
    userId: 2
  }, {
    body: "This comment is amazing!",
    postId: 5,
    userId: 2
  } ]
};

module.exports = {
  up: (queryInterface, Sequelize) => {

    const comments = [];
    seeds.comments.forEach( ( seed ) => {
      const values = { ...seed };
      values.createdAt = new Date();
      values.updatedAt = new Date();
      comments.push( values );
    } );

    return queryInterface.bulkInsert( "Comments", comments, {} );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete( "Comments", null, {} );
  }
};
