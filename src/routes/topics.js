const express = require( "express" );
const router = express.Router();
const topicController = require( "../controllers/topicController.js" );
const validation = require( "./validation.js" );
const authHelper = require( "../auth/helpers.js" );

const base = "/topics";

router.get( base,
  topicController.index );

router.get( `${ base }/new`,
  authHelper.ensureAuthenticated,
  topicController.new );
router.post( `${ base }/create`,
  authHelper.ensureAuthenticated,
  validation.validateTopics,
  topicController.create );

router.get( `${ base }/:id`,
  topicController.show );

router.post( `${ base }/:id/destroy`,
  authHelper.ensureAuthenticated,
  topicController.destroy );
router.get( `${ base }/:id/edit`,
  authHelper.ensureAuthenticated,
  topicController.edit );
router.post( `${ base }/:id/update`,
  authHelper.ensureAuthenticated,
  validation.validateTopics,
  topicController.update );

module.exports = router;
