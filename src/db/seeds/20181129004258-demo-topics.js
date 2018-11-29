'use strict';

const seeds = {
  topics: [ {
    title: "JavaScript Frameworks",
    description: "There are a lot of them."
  }, {
    title: "blink-182 songs",
    description: "What's your favorite blink-182 song?"
  }, {
    title: "Winter Games",
    description: "Post your Winter Games stories."
  }, {
    title: "Expeditions to Alpha Centauri",
    description: "A compilation of reports from recent visits to the star system."
  }, {
    title: "Challenges of interstellar travel",
    description: "1. The Wi-Fi is terrible"
  } ]
};

module.exports = {
  up: ( queryInterface, Sequelize ) => {

    const topics = [];
    seeds.topics.forEach( ( seed ) => {
      const values = { ...seed };
      values.createdAt = new Date();
      values.updatedAt = new Date();
      topics.push( values );
    } );

    return queryInterface.bulkInsert( "Topics", topics, {} );
  },
  down: ( queryInterface, Sequelize ) => {
    return queryInterface.bulkDelete( "Topics", null, {} );
  }
};
