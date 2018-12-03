'use strict';

const seeds = {
  posts: [ {
    title: "Snowball Fighting",
    body: "So much snow!",
    topicId: 3,
    userId: 1
  }, {
    title: "Watching snow melt",
    body: "Without a doubt my favoriting things to do besides watching paint dry!",
    topicId: 3,
    userId: 2
  }, {
    title: "Snowman Building Competition",
    body: "I love watching them melt slowly.",
    topicId: 3,
    userId: 1
  }, {
    title: "Outdoor Escape!",
    body: "Anybody want to do the maze at The Overlook Hotel?",
    topicId: 3,
    userId: 2
  }, {
    title: "My first visit to Proxima Centauri b",
    body: "I saw some rocks.",
    topicId: 4,
    userId: 2
  }, {
    title: "Pros of Cryosleep during the long journey",
    body: "1. Not having to answer the 'are we there yet?' question.",
    topicId: 5,
    userId: 1
  }, {
    title: "Dress code on Proxima b",
    body: "Spacesuit, space helmet, space boots, and space gloves",
    topicId: 4,
    userId: 1
  } ]
};

module.exports = {
  up: ( queryInterface, Sequelize ) => {

    const posts = [];
    seeds.posts.forEach( ( seed ) => {
      const values = { ...seed };
      values.createdAt = new Date();
      values.updatedAt = new Date();
      posts.push( values );
    } );

    return queryInterface.bulkInsert( "Posts", posts, {} );
  },
  down: ( queryInterface, Sequelize ) => {
    return queryInterface.bulkDelete( "Posts", null, {} );
  }
};
