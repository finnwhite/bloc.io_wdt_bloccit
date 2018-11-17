const express = require( "express" );
const router = express.Router();
const postController = require( "../controllers/postController.js" );
const base = "/topics/:topicId/posts";

router.get( `${ base }/new`, postController.new );
router.post( `${ base }/create`, postController.create );
router.get( `${ base }/:id`, postController.show );
router.post( `${ base }/:id/destroy`, postController.destroy );
router.get( `${ base }/:id/edit`, postController.edit );
router.post( `${ base }/:id/update`, postController.update );

module.exports = router;
