const express = require( "express" );
const router = express.Router();
const postController = require( "../controllers/postController.js" );
const validation = require( "./validation.js" );
const authHelper = require( "../auth/helpers.js" );

const base = "/topics/:topicId/posts";

router.get( `${ base }/new`,
  authHelper.ensureAuthenticated,
  postController.new );
router.post( `${ base }/create`,
  authHelper.ensureAuthenticated,
  validation.validatePosts,
  postController.create );

router.get( `${ base }/:id`,
  postController.show );

router.post( `${ base }/:id/destroy`,
  authHelper.ensureAuthenticated,
  postController.destroy );
router.get( `${ base }/:id/edit`,
  authHelper.ensureAuthenticated,
  postController.edit );
router.post( `${ base }/:id/update`,
  authHelper.ensureAuthenticated,
  validation.validatePosts,
  postController.update );

module.exports = router;
