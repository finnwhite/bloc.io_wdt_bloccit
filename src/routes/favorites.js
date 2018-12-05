const express = require( "express" );
const router = express.Router();
const favoriteController = require( "../controllers/favoriteController.js" );
//const authHelper = require( "../auth/helpers.js" );

const base = "/topics/:topicId/posts/:postId/favorites";

router.post( `${ base }/create`,
  //authHelper.ensureAuthenticated,
  favoriteController.create );

router.post( `${ base }/:id/destroy`,
  //authHelper.ensureAuthenticated,
  favoriteController.destroy );

module.exports = router;
