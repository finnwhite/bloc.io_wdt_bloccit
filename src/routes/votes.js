const express = require( "express" );
const router = express.Router();
const voteController = require( "../controllers/voteController.js" );
//const authHelper = require( "../auth/helpers.js" );

const base = "/topics/:topicId/posts/:postId/votes";

router.get( `${ base }/upvote`,
  //authHelper.ensureAuthenticated,
  voteController.upvote );

router.get( `${ base }/downvote`,
  //authHelper.ensureAuthenticated,
  voteController.downvote );

module.exports = router;
