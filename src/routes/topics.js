const express = require( "express" );
const router = express.Router();
const topicController = require( "../controllers/topicController.js" );
const validation = require( "./validation.js" );

const base = "/topics";

router.get( base, topicController.index );
router.get( `${ base }/new`, topicController.new );
router.post( `${ base }/create`,
  validation.validateTopics, topicController.create );
router.get( `${ base }/:id`, topicController.show );
router.post( `${ base }/:id/destroy`, topicController.destroy );
router.get( `${ base }/:id/edit`, topicController.edit );
router.post( `${ base }/:id/update`,
  validation.validateTopics, topicController.update );

module.exports = router;
