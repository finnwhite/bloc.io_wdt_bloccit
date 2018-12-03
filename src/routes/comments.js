const express = require( "express" );
const router = express.Router();
const commentController = require( "../controllers/commentController.js" );
const validation = require( "./validation.js" );
const authHelper = require( "../auth/helpers.js" );

const base = "/topics/:topicId/posts/:postId/comments";

router.post( `${ base }/create`,
  authHelper.ensureAuthenticated,
  validation.validateComments,
  commentController.create );

router.post( `${ base }/:id/destroy`,
  authHelper.ensureAuthenticated,
  commentController.destroy );

module.exports = router;
