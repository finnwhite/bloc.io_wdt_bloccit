const express = require( "express" );
const router = express.Router();
const controller = require( "../controllers/flairController.js" );
const base = "/flairs";

router.get( `${ base }`, controller.index );
router.get( `${ base }/add`, controller.add );
router.post( `${ base }/create`, controller.create );
router.get( `${ base }/:id`, controller.view );
router.get( `${ base }/:id/edit`, controller.edit );
router.post( `${ base }/:id/update`, controller.update );
router.post( `${ base }/:id/delete`, controller.delete );

module.exports = router;
