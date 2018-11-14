const express = require( "express" );
const router = express.Router();
const controller = require( "../controllers/advertisementController.js" );

router.get( "/advertisements", controller.index );
router.get( "/advertisements/add", controller.add );
router.post( "/advertisements/create", controller.create );
router.get( "/advertisements/:id", controller.view );
router.get( "/advertisements/:id/edit", controller.edit );
router.post( "/advertisements/:id/update", controller.update );
router.post( "/advertisements/:id/delete", controller.delete );

module.exports = router;
